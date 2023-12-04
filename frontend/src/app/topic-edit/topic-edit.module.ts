import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopicEditPage } from './topic-edit.page';

import { IonicModule } from '@ionic/angular';

import { TopicEditPageRoutingModule } from './topic-edit-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TopicEditPageRoutingModule],
  declarations: [TopicEditPage],
})
export class TopicEditPageModule {}
