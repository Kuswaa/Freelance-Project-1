import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'home',
        component: LayoutComponent,
        canActivate: [authGuard] // ✅ function, lowercase
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
    }
];
