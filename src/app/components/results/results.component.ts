// results.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html'
})
export class ResultsComponent {
  results: any[] = [];

  constructor(private searchService: SearchService, private router: Router) {
    // Get results from the service
    this.results = this.searchService.getResults();

    // If no results, redirect back to home
    if (!this.results || this.results.length === 0) {
      this.router.navigate(['/home']);
    }
  }
}
