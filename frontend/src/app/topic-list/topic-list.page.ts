import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.page.html',
  styleUrls: ['./topic-list.page.scss'],
})


export class TopicListPage implements OnInit {
  topicos: any = [];
  topicosCompartidosConmigo: any = [];
  topicosPorLikes: any = [];
  textoTopicosCompartidos: string = "Topicos compartidos con el Usuario:"
  userLiked: boolean = false;

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
    this.getTopics();
    this.getTopicsShareMe()
    this.getTopicsByLikes()
  }

  ngOnInit() {
  }

  async confirmDelete(topico: any) {
    console.log(topico);

    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: `
      ¿Estas seguro?\n\n
      Esto es irreversible se eliminara toda la informacion sobre ${topico.name}.
      `,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteTopic(topico.id);
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

  getTopics() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/topics/list', config)
      .then((result) => {
        if (result.data.success == true) {
          this.topicos = result.data.topicos;
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  deleteTopic(id: any) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/topics/delete/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.presentToast('Topico Eliminado');
          this.getTopics();
          this.getTopicsByLikes();
          this.getTopicsShareMe();
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

  //Ordenar visualmente
  reorder(event: any) {
    const moverItem = this.topicos.splice(event.detail.from, 1)[0];
    this.topicos.splice(event.detail.to, 0, moverItem);
    event.detail.complete();

  }

  sortAZ() {
    this.topicos.sort((a: any, b: any) => {
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
    this.topicos.sort((a: any, b: any) => {
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
    this.topicos.sort((a: any, b: any) => a.id - b.id);
  }

  sortIdDesc() {
    this.topicos.sort((a: any, b: any) => b.id - a.id);
  }

  getTopicsShareMe() {
    const user_id = localStorage.getItem('user_id');

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/topics/shared_me/' + user_id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.topicosCompartidosConmigo = result.data.topicos
          if (this.topicosCompartidosConmigo.length == 0) {
            this.textoTopicosCompartidos = "No se compartieron topicos con el Usuario actual"
          }
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  saveOrder() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    const orderData = this.topicos.map((tema: any, index: any) => ({ id: tema.id, order_index: index }));
    axios.post('http://localhost:3000/topics/update-order', orderData, config)
      .then((result) => {
        if (result.data.success) {
          this.presentToast('Orden guardado con éxito');
        }
      })
      .catch((error) => {
        this.presentToast('Error al guardar el orden: ' + error.message);
      });
  }


  async confirmDeleteUsuario(topico: any) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: `Desea eliminar el Topico que ${topico.shared_by_user_name} ${topico.shared_by_user_last_name} compartio contigo?`,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteShareMeTopics(topico.id_shared_topics);
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

  deleteShareMeTopics(id: number) {

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/topics/shared-me-delete/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.getTopicsShareMe()
          this.presentToast('Eliminado...');
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        this.presentToast(error.message);
      });
  }

  getTopicsByLikes() {
    //const user_id = localStorage.getItem('user_id');

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/topics/byLikes', config)
      .then((result) => {
        if (result.data.success == true) {

          this.topicosPorLikes = result.data.data
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
}
