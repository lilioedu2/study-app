import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopicEditPage } from './topic-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TopicEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicEditPageRoutingModule {}
