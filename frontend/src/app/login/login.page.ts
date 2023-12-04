import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public message!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  usuario: any = '';
  isModal: boolean = false
  emailRecuperacion: string = ''
  usuarios: any = []
  textSendEmail: string = '';

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    //con este comando se recupera el id que se pasa
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    axios
      .get('http://localhost:3000/users/buscarPorCodigo/0')
      .then((result) => {
        if (result.data.success == true) {
          if (result.data.usuario != null) {
            this.usuario = result.data.usuario;

          } else {
            this.usuario = {};
          }
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }

  loginUser() {
    console.log('usuario: ', this.usuario);
    var data = {
      email: this.usuario.email,
      password: this.usuario.password,
    };
    axios
      .post('http://localhost:3000/user/login', data)
      .then(async (result) => {
        if (result.data.success == true) {
          this.presentToast('Bienvenido a StudyApp');
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('user_id', result.data.user_id);
          this.router.navigate(['/home']);
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch(async (error) => {
        this.presentToast(error.message);
      });
  }
  ionViewWillEnter(): void {
    //verificar si el usuario esta logueado
    let token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  showRecoverPasswordModal() {
    this.emailRecuperacion = ''
    this.textSendEmail = ''
    this.isModal = !this.isModal;
  }

  getUsers() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/users/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.usuarios = result.data.usuarios;
          const usuario = this.verificarCorreo()

          if (usuario)
            this.crearNuevaPassword(usuario.id)
          else
            this.presentToast("No existe el usuario");

        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  verificarCorreo() {
    return this.usuarios.find((usuario: any) => usuario.email === this.emailRecuperacion);
  }



  enviarEmail(newPassword: any) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    const dataSend = {
      destinoEmail: this.emailRecuperacion,
      subject: 'Recuperación de Contraseña para StudyAPP',
      html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Recuperación de Contraseña</title>
        <style>
          body {
            font-family: 'Verdana', sans-serif;
            background-color: #e8eff1;
            color: #555;
            line-height: 1.4;
          }
          .main-container {
            margin: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #007bff;
            color: white;
            padding: 15px;
            text-align: center;
          }
          .body-content {
            padding: 20px;
            background-color: white;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            border-top: 1px solid #dee2e6;
          }
          .info-text {
            background-color: #d1ecf1;
            border-color: #bee5eb;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
          }
          .password {
            display: inline-block;
            background-color: #ffc107;
            padding: 5px 10px;
            margin: 5px 0;
            border-radius: 4px;
            color: black;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="main-container">
          <div class="header">
            <h2>Recuperación de Contraseña - StudyAPP</h2>
          </div>
          <div class="body-content">
            <p>Estimado/a <strong>${newPassword.name} ${newPassword.lastName}</strong>,</p>
            <p>Le informamos que hemos procesado su solicitud para restablecer la contraseña de su cuenta en <strong>StudyAPP</strong>.</p>
            <p class="info-text">Su nueva contraseña temporal es: <span class="password">${newPassword.newPassword}</span></p>
            <p>Por su seguridad, le sugerimos modificar esta contraseña temporal después de iniciar sesión. Si usted no ha solicitado este cambio o necesita asistencia, por favor contacte a nuestro soporte técnico.</p>
            <p>¡Apreciamos su preferencia en StudyAPP!</p>
          </div>
          <div class="footer">
            Saludos cordiales,<br>
            Equipo de StudyAPP
          </div>
        </div>
      </body>
      </html>
      `
    };

    axios.post('http://localhost:3000/themes_properties/enviaremail', dataSend, config)
      .then((result) => {
        if (result.data.success) {
          this.textSendEmail = 'Ya se envió el email';
          this.presentToast('Email enviado!');
        }
      })
      .catch((error) => {
        console.log(error);
        this.presentToast('Error: ' + error.message);
      });
  }

  crearNuevaPassword(id: number) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/users/new-password/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.enviarEmail(result.data.newPassword)
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  recuperarPassword() {
    this.getUsers()
  }

}
