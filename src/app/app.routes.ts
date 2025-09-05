import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { ResultsComponent } from './components/results/results.component';
import { DetailsComponent } from './components/details/details.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Login route unprotected
  { path: 'login', component: LoginComponent },

  // Protected layout with children
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },          // /home
      { path: 'results', component: ResultsComponent }, // /home/results
      { path: 'details/:cedula', component: DetailsComponent } // /home/details/:cedula
    ]
  },

  // Catch-all redirects to login
  { path: '**', redirectTo: '/login' }
];
