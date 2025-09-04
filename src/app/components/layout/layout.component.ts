import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { HomeComponent } from "../home/home.component";
import { ResultsComponent } from '../results/results.component';
import { DetailsComponent } from '../details/details.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [HeaderComponent, HomeComponent, ResultsComponent, DetailsComponent, RouterOutlet],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
