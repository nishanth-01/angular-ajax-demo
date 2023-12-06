import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { GeneralAppComponent } from './general-app/general-app.component';
import { AdminAppComponent } from './admin-app/admin-app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', title: 'Redirect', redirectTo: '/app', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'logout', title: 'Logout', component: LogoutComponent },
  { path: 'app', title: 'App', component: GeneralAppComponent },
  { path: 'app/admin', title: 'Admin', component: AdminAppComponent },
  { path: '**', title: '404', component: PageNotFoundComponent }
];
