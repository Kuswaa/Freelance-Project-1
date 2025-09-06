import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    logout() {
    console.log('Logout button clicked');
    this.authService.logout().subscribe({
        next: () => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']); // redirect after logout
        },
        error: (err) => console.error('Logout failed', err)
    });
}


}
