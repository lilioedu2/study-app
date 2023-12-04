import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import axios from 'axios';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.page.html',
  styleUrls: ['./topic-edit.page.scss'],
})
export class TopicEditPage implements OnInit {
  public message!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  topic: any = '';
  accion = 'Crear Topico';
  links: any[] = []
  nuevoLink: string = ''
  openNewLink: boolean = false
  switchLink: boolean = false

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    axios
      .get('http://localhost:3000/topics/buscarPorCodigo/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          if (id !== '0') {
            this.switchLink = true
            this.accion = 'Editar Topico';
            if (result.data.topic != null) {
              this.topic = result.data.topic;
              let linksTopic = this.topic.link;
              linksTopic = linksTopic.slice(1, -1);
              let arreglo = linksTopic.split('","');
              this.links = arreglo.map((elemento: any) => elemento.replace(/"/g, ''));
              console.log(this.links);
            } else {
              this.topic = {};
              this.links = []; // Inicializa links para un tópico sin links
            }
          } else {
            // Aquí manejas el caso de crear un nuevo tópico
            this.topic = {
              // Inicializa las propiedades de un nuevo tópico si es necesario
            };
            this.links = ['']; // Inicializa con un elemento vacío para permitir la entrada de un nuevo link
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

  saveTopic() {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    this.topic.link = '"' + this.links.join('","') + '"';

    let fecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    var data = {
      id: this.topic.id,
      topic_id: this.topic.id,
      create_date: fecha,
      name: this.topic.name,
      order: this.topic.order,
      priority: this.topic.priority,
      color: this.topic.color,
      link: this.topic.link,
      //owner_user_id: this.topico.owner_user_id,
    };

    axios
      .post('http://localhost:3000/topics/update', data, config)
      .then(async (result) => {
        if (result.data.success == true) {
          this.nuevoLink = ''
          this.openNewLink = false
          this.presentToast('Topico Guardado');
          this.router.navigate(['/topic-list']);
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch(async (error) => {
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

  trackByFn(index: any) {
    return index;
  }

  agregarNuevoLink() {
    if (this.nuevoLink !== '') {
      if (this.links.length == 1 && this.switchLink == false) {
        this.links.shift()
        this.switchLink = true
      }
      this.links.push(this.nuevoLink)
      this.nuevoLink = ''
    }
  }

  eliminarLink(link: string) {
    const index = this.links.indexOf(link);
    if (index > -1) {
      this.links.splice(index, 1);
    }
  }

}
