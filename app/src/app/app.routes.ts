import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GeneralAppComponent } from './general-app/general-app.component';
import { AdminAppComponent } from './admin-app/admin-app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { authAdminGuard } from './auth-admin.guard';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Redirect',
    redirectTo: '/app',
    pathMatch: 'full'
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent
  },
  {
    path: 'app',
    title: 'Home',
    component: GeneralAppComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    title: 'Admin',
    component: AdminAppComponent,
    canActivate: [authAdminGuard],
  },
  {
    path: '**',
    title: '404',
    component: PageNotFoundComponent
  }
];
