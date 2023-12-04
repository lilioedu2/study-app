import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThemeListPage } from './theme-list.page';

const routes: Routes = [
  {
    path: '',
    component: ThemeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeListPageRoutingModule {}
