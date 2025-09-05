// src/app/components/results/results.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Person } from '../../services/search.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {
  results: Person[] = [];
  loading = false;

  pageSize = 10;
  currentPage = 0;
  totalPages = 0;

  private subscription = new Subscription();

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    // ✅ Subscribe to both results and loading
    this.subscription.add(
      this.searchService.results$.subscribe(results => {
        console.log('📦 Normalized results in ResultsComponent:', results);
        this.results = results;
        this.totalPages = Math.ceil(this.results.length / this.pageSize);

        // Optional: if empty, redirect back
        if (!this.loading && this.results.length === 0) {
          console.warn('⚠️ No results found, redirecting to /home');
          // this.router.navigate(['/home']);
        }
      }
    ));

    this.subscription.add(
      this.searchService.loading$.subscribe(l => {
        console.log('⏳ Loading updated in ResultsComponent:', l);
        this.loading = l;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Pagination
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
