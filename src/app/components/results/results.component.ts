// src/app/components/results/results.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Person } from '../../services/search.types';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Person[] = [];
  pageSize = 10;
  currentPage = 0;
  totalPages = 0;

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    const fetched = this.searchService.getResults();
    console.log('Fetched in result component:', fetched);

    this.results = fetched ?? [];
    console.log('Final this.results:', this.results);

    if (this.results.length === 0) {
      this.router.navigate(['/home']);
    } else {
      this.totalPages = Math.ceil(this.results.length / this.pageSize);
    }
  }

  paginatedResults(): Person[] {
    const start = this.currentPage * this.pageSize;
    return this.results.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
