import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'view-message/:id',
    loadChildren: () =>
      import('./view-message/view-message.module').then(
        (m) => m.ViewMessagePageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'user-edit/:id',
    loadChildren: () =>
      import('./user-edit/user-edit.module').then(
        (m) => m.UserEditPageModule
      ),
  },
  {
    path: 'user-list',
    loadChildren: () =>
      import('./user-list/user-list.module').then(
        (m) => m.UserListPageModule
      ),
  },
  {
    path: 'topic-list',
    loadChildren: () =>
      import('./topic-list/topic-list.module').then(
        (m) => m.TopicListPageModule
      ),
  },
  {
    path: 'topic-edit/:id',
    loadChildren: () =>
      import('./topic-edit/topic-edit.module').then(
        (m) => m.TopicEditPageModule
      ),
  },
  {
    path: 'theme-list',
    loadChildren: () =>
      import('./theme-list/theme-list.module').then(
        (m) => m.ThemeListPageModule
      ),
  },
  {
    path: 'theme-edit/:id',
    loadChildren: () =>
      import('./theme-edit/theme-edit.module').then(
        (m) => m.ThemeEditPageModule
      ),
  },
  {
    path: 'topic-details/:id',
    loadChildren: () => import('./topic-details/topic-details.module').then(m => m.TopicDetailsPageModule)
  },
  {
    path: 'theme-details/:id',
    loadChildren: () => import('./theme-details/theme-details.module').then( m => m.ThemeDetailsPageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
