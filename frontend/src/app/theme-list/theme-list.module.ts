import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeListPage } from './theme-list.page';

import { IonicModule } from '@ionic/angular';

import { ThemeListPageRoutingModule } from './theme-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThemeListPageRoutingModule
  ],
  declarations: [ThemeListPage]
})
export class ThemeListPageModule {}
