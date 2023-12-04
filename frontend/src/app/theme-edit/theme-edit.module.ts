import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeEditPage } from './theme-edit.page';

import { IonicModule } from '@ionic/angular';

import { ThemeEditPageRoutingModule } from './theme-edit-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThemeEditPageRoutingModule
  ],
  declarations: [ThemeEditPage]
})
export class ThemeEditPageModule {}
