import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopicListPage } from './topic-list.page';

const routes: Routes = [
  {
    path: '',
    component: TopicListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicListPageRoutingModule {}
