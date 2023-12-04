import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSelect, Platform, ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.page.html',
  styleUrls: ['./topic-details.page.scss'],
})
export class TopicDetailsPage implements OnInit {
  topic: any;
  private activatedRoute = inject(ActivatedRoute);
  accion = 'Agregar Topico';
  topicoComentarios: any = [];
  Comentarios: string = "Comentarios";
  isModal: boolean = false;
  newComentario: string = ""
  private platform = inject(Platform);
  idUsuarioActual: number = 0
  usuarios: any = [];
  usuariosSeleccionados: number[] = [];
  @ViewChild('selectUsuarios', { static: false }) selectUsuarios: IonSelect | undefined; // Agregamos "undefined"
  mostrarSelectUsuarios: boolean = false
  usuariosFiltrados: any = []
  topicsShareMe: any = []
  isLiked: boolean = false;
  links: any[] = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ionViewWillEnter(): void {
    //verificar si el usuario no esta logueado
    let token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.userLiked()

  }

  ngOnInit() {
    this.getUsers()

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    //con este comando se recupera el id que se pasa
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    // this.message = this.data.getMessageById(parseInt(id, 10));
    axios
      .get('http://localhost:3000/topics/buscarPorCodigo/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          if (id !== '0') {
            this.accion = 'Detalles Topico';
          }
          if (result.data.topic != null) {
            this.topic = result.data.topic;
            let linksTopic = this.topic.link;
            linksTopic = linksTopic.slice(1, -1);
            let arreglo = linksTopic.split('","');
            this.links = arreglo.map((elemento: any) => elemento.replace(/"/g, ''));
          } else {
            this.topic = {};
          }
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
    this.getTopicsComments(id)
  }

  getTopicsComments(topic_id: string) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/topic-details/' + topic_id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.topicoComentarios = result.data.topicos;
          const valor = localStorage.getItem('user_id');
          this.idUsuarioActual = valor !== null ? Number(valor) : 0; // O algún valor por defecto en lugar de 0

          if (this.topicoComentarios.length == 0) {
            this.Comentarios = "Sin Comentarios"
          }

        } else {
          console.log(result.data);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  formatDate(date: string): string {

    const fecha = new Date(date);
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Sumar 1 ya que los meses comienzan desde 0 (enero)
    const anio = fecha.getFullYear();

    const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;

    return `${horaFormateada} ${fechaFormateada}`;
  }

  abrirCerrarModal() {
    this.isModal = !this.isModal
  }

  guardarComentario() {
    const user_id = localStorage.getItem('user_id');
    const comentarioTopico = {
      text: this.newComentario,
      topic_id: this.topic.id,
      user_id: user_id,
    };

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    axios.post('http://localhost:3000/topics-details/comment', comentarioTopico, config)
      .then((result) => {
        if (result.data.success === true) {
          this.presentToast("Comentario agregado.")
          this.newComentario = ''
          this.abrirCerrarModal()
          this.getTopicsComments(this.topic.id)
        } else {
          console.log(result.data.error);

        }
      })
      .catch((error) => {
        console.log(error);

      });
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
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
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  compartir(topico: any) {
    const user_id = Number(localStorage.getItem('user_id'));
    this.usuariosFiltrados = this.usuarios.filter((usuario: any) => usuario.id !== user_id);
    this.mostrarSelectUsuarios = true;
    if (this.selectUsuarios) {
      this.selectUsuarios.open();
    }
  }

  abrirCerrarModalCompartir() {
    this.mostrarSelectUsuarios = !this.mostrarSelectUsuarios
  }

  async grabarCompartir() {
    if (this.usuariosSeleccionados.length == 0) {
      const alert = await this.alertController.create({
        header: 'Mensaje',
        message: 'Debe selecionar al menos un usuario para compartir.',
        buttons: [
          {
            text: 'OK'
          },
        ],
      });
      await alert.present();
      return
    }

    this.abrirCerrarModalCompartir()
    const user_id = localStorage.getItem('user_id');
    const datosShareTopics = {
      user_shared_id: user_id,
      topic_id: this.topic.id,
      user_destination_ids: this.usuariosSeleccionados
    }

    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    axios.post('http://localhost:3000/topics-shared', datosShareTopics, config)
      .then((result) => {
        if (result.data.success === true) {
          this.presentToast("Topico compartido.")
        } else {
          console.log(result.data.error);

        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }

  deleteComentario(id: any, idTopico: string) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/topics/comenterio-delete/' + id, config)
      .then((result) => {
        if (result.data.success == true) {
          this.presentToast('Comentario Eliminado');
          this.getTopicsComments(idTopico);
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        this.presentToast(error.message);
      });
  }

  async confirmDelete(id: string, idTopico: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Desea eliminar el comentario?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteComentario(id, idTopico);
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

  likeTopic(topicoId: any) {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const data = {
      userId: user_id,
      topicId: topicoId
    };

    axios.post('http://localhost:3000/topics/like', data, config)
      .then((result) => {
        if (result.data.success) {
          this.isLiked = true
        }
      })
      .catch((error) => {
        this.presentToast('Error al guardar');
      });

  }

  dislikeTopic() {
    const user_id = localStorage.getItem('user_id');
    const topic_id = this.activatedRoute.snapshot.paramMap.get('id') as string;

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete(`http://localhost:3000/topics/dislike/${user_id}/${topic_id}`, config)
      .then((result) => {
        if (result.data.success == true) {
          this.isLiked = false
        } else {
          this.presentToast(result.data.error);
        }
      })
      .catch((error) => {
        this.presentToast(error.message);
      });
  }

  userLiked() {
    const user_id = localStorage.getItem('user_id');
    const topic_id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get(`http://localhost:3000/topics/userHasLiked/${user_id}/${topic_id}`, config)
      .then((result) => {
        if (result.data.success) {
          this.isLiked = result.data.data
        } else {
          console.log(result.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  trackByFn(index: any) {
    return index;
  }

}
