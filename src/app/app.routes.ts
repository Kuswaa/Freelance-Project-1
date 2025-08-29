import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'home',
        component: LayoutComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'results',
        loadComponent: () => import('./components/results/results.component').then(m => m.ResultsComponent),
        canActivate: [authGuard]
    }
];
