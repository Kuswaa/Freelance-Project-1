import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
    // {
    //     path: 'dashboard',
    //     component: LayoutComponent,
    //     children: [
    //     { path: '', redirectTo: 'home', pathMatch: 'full' },
    //     { path: 'home', component: HomeComponent },
    //     ],
    // },
    
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: LayoutComponent }
];
