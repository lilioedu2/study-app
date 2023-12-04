import { Component, OnInit, inject } from '@angular/core';
import { RefresherCustomEvent, ToastController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private data = inject(DataService);
  temas: any = [];
  temas_propiedades: any = [];
  isOpenModal: boolean = false;
  descripcion: string = ''
  temaSelecionado: any;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    let token = localStorage.getItem('token');
    //localStorage.removeItem("token");
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.getThemes();
    this.getThemesProperties();
  }

  cerrarSesion() {
    let token = localStorage.getItem('token');
    let data = '';
    let config = {
      headers: {
        authorization: token,
      },
    };
    axios
      .post('http://localhost:3000/user/logout', data, config)
      .then(async (result) => {
        console.log('aber', config);
        if (result.data.success == true) {
          console.log('qlqpasa');
          localStorage.removeItem('token');
          this.presentToast('Sesion Finalizada');
          this.router.navigate(['/login']);
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch(async (error) => {
        this.presentToast(error.message);
      });
  }

  ngOnInit(): void { }

  getThemes() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/themes/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.temas = result.data.temas;

        } else {
          console.log('error:', result.data.error);
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.presentToast(error.message);
      });
  }

  getThemesProperties() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/themes_properties/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.temas_propiedades = result.data.themes_properties;
        } else {
          console.log(result.data.error);
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.presentToast(error.message);
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  cerrarAbrirModal() {
    this.isOpenModal = !this.isOpenModal
  }

  guardarTema(tema: any) {
    this.cerrarAbrirModal()
    this.temaSelecionado = tema
  }

  guardarPropiedad() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    const data = {
      theme_id: this.temaSelecionado.id,
      property_name: this.descripcion,
      property_value: "1010"
    }


    axios
    .post('http://localhost:3000/themes_properties/add', data, config)
    .then(async (result) => {
      if (result.data.success == true) {
          this.descripcion = ''
          this.presentToast('Guardado');
          this.getThemes()
          this.getThemesProperties()
          this.cerrarAbrirModal()
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch(async (error) => {
        this.presentToast(error.message);
      });
  }
}
