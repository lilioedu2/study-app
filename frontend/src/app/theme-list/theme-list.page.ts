import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.page.html',
  styleUrls: ['./theme-list.page.scss'],
})
export class ThemeListPage implements OnInit {
  temas: any = [];
  private platform = inject(Platform);
  public alertButtons = ['Aceptar', 'Cancelar'];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.getThemes();
  }

  ngOnInit() { }

  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Desea eliminar el registro?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteTheme(id);
          },
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelado');
          },
        },
      ],
    });
    await alert.present();
  }

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
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  deleteTheme(id: any) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/themes/delete/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.presentToast('Tema Eliminado');
          this.getThemes();
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        this.presentToast(error.message);
      });
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? '' : '';
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }

  // Agrega una función para guardar el nuevo orden en el backend
  saveOrder() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    const orderData = this.temas.map((tema: any, index: any) => ({ id: tema.id, order_index: index }));
    axios.post('http://localhost:3000/themes/update-order', orderData, config)
      .then((result) => {
        if (result.data.success) {
          this.presentToast('Orden guardado con éxito');
        }
      })
      .catch((error) => {
        this.presentToast('Error al guardar el orden: ' + error.message);
      });
  }

  // Modifica la función de reordenamiento para que llame a saveOrder
  reorder(event: any) {
    const moverItem = this.temas.splice(event.detail.from, 1)[0];
    this.temas.splice(event.detail.to, 0, moverItem);
    event.detail.complete();
  }


  //ordenamientos
  sortAZ() {
    this.temas.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortZA() {
    this.temas.sort((a: any, b: any) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }

  sortIdAsc() {
    this.temas.sort((a: any, b: any) => a.id - b.id);
  }

  sortIdDesc() {
    this.temas.sort((a: any, b: any) => b.id - a.id);
  }

  cambiarPantalla(id: any) {
    this.router.navigate(['/theme-details/' + id])
  }
}
