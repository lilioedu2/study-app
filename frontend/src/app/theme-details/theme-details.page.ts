import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-theme-details',
  templateUrl: './theme-details.page.html',
  styleUrls: ['./theme-details.page.scss'],
})

export class ThemeDetailsPage implements OnInit {
  private platform = inject(Platform);
  themesProperties: any = [];
  private activatedRoute = inject(ActivatedRoute);
  isModalThemesProperties: boolean = false;
  newThemeProperty: { propertyName: string; propertyValue: string } = { propertyName: '', propertyValue: '' };
  currentTheme: any;
  titulo: string = '';
  idpropiedad: number = 0;

  constructor() { }

  ngOnInit() {
    const id_theme = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.getThemesProperties(id_theme);
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? '' : '';
  }

  getThemesProperties(temaid: string) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .get('http://localhost:3000/themes_properties/buscarPorTema/' + temaid, config)
      .then((result) => {
        if (result.data.success == true) {
          this.themesProperties = result.data.themes_properties;
        } else {
          console.log(result.data);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  confirmDeleteProperties(id: string, temaid: any) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };
    axios
      .delete('http://localhost:3000/themes_properties/delete/' + id, config)
      .then((result) => {
        if (result.data.success === true) {
          this.getThemesProperties(temaid);
        } else {
          console.log("error");
        }
      });
  }

  abrirModalThemesProperties() {
    this.isModalThemesProperties = true;
    const id_theme = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.currentTheme = id_theme;
    this.titulo = 'Agregar';
  }

  cerrarModalThemesProperties() {
    this.isModalThemesProperties = false;
    this.newThemeProperty = { propertyName: '', propertyValue: '' };
  }

  guardarThemesProperties(titulo: string) {
    let token = localStorage.getItem('token');
    let config = {
      headers: {
        Authorization: token,
      },
    };

    if (titulo == 'Agregar') {
      if (!this.newThemeProperty.propertyName || !this.newThemeProperty.propertyValue) {
        console.error('Por favor, completa todos los campos.');
        return;
      }

      const themeProperty = {
        theme_id: this.currentTheme,
        property_name: this.newThemeProperty.propertyName,
        property_value: this.newThemeProperty.propertyValue,
      };

      axios
        .post('http://localhost:3000/themes_properties/add', themeProperty, config)
        .then((result) => {
          if (result.data.success === true) {
            this.getThemesProperties(themeProperty.theme_id);
          } else {
            console.error("Error al agregar propiedad de tema", result.data.error);
          }
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud', error);
        });

      this.cerrarModalThemesProperties();
    } else {
      const id_theme = this.activatedRoute.snapshot.paramMap.get('id') as string;
      const themeProperty = {
        id: this.idpropiedad,
        theme_id: id_theme,
        property_name: this.newThemeProperty.propertyName,
        property_value: this.newThemeProperty.propertyValue,
      };
      console.log(themeProperty);

      axios
        .post('http://localhost:3000/themes_properties/update', themeProperty, config)
        .then((result) => {
          if (result.data.success === true) {
            this.getThemesProperties(id_theme);
            this.newThemeProperty.propertyName = '';
            this.newThemeProperty.propertyValue = '';
            this.isModalThemesProperties = false;
          } else {
            console.error("Error al agregar propiedad de tema", result.data.error);
          }
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud', error);
        });
    }
  }

  abrirCerrarModal(property: any) {
    this.isModalThemesProperties = !this.isModalThemesProperties;
    this.newThemeProperty.propertyName = property.property_name;
    this.newThemeProperty.propertyValue = property.property_value;
    this.idpropiedad = property.id;
    this.titulo = "Editar";
  }
}
