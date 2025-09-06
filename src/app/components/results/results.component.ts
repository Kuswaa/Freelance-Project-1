import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Person } from '../../services/search.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  private hasSearched = false;

  ngOnInit(): void {
    this.subscription.add(
      this.searchService.results$.subscribe(results => {
        console.log('📦 Normalized results in ResultsComponent:', results);
        this.results = results;
        this.totalPages = Math.ceil(this.results.length / this.pageSize);

        if (this.hasSearched && !this.loading && results.length === 0) {
          console.warn('⚠️ No results found');
        }
      })
    );

    this.subscription.add(
      this.searchService.loading$.subscribe(l => {
        console.log('⏳ Loading updated in ResultsComponent:', l);
        this.loading = l;
        if (!l) this.hasSearched = true; // mark search complete
      })
    );
  }


  ngOnDestroy(): void {
    console.log('🛑 ResultsComponent destroyed, unsubscribing');
    this.subscription.unsubscribe();
  }

  // Pagination
  paginatedResults(): Person[] {
    const start = this.currentPage * this.pageSize;
    return this.results.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      console.log('➡️ Next page');
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      console.log('⬅️ Previous page');
      this.currentPage--;
    }
  }

  viewDetails(person: Person) {
    console.log('🔗 Navigating to details for cedula:', person.cedula);
    this.router.navigate(['/home/details', person.cedula]);
  }

  logPerson(person: Person) {
  console.log('Navigating to details for', person.cedula);
}


}
