import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SearchResponse, Person } from './search.types';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = 'http://127.0.0.1:5000/scrape';

  private resultsSubject = new BehaviorSubject<Person[]>([]);
  results$ = this.resultsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** 🔍 Perform search and update results + loading */
  search(type: string, value: string): void {
    console.log(`🚀 Sending search request | type: ${type}, value: ${value}`);
    this.loadingSubject.next(true);

    this.http.post<SearchResponse>(this.apiUrl, { type, value }).subscribe({
      next: (res) => {
        console.log('🔥 RAW Flask response:', res);
        this.resultsSubject.next(res.results ?? []);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('❌ Search error:', err);
        this.resultsSubject.next([]);
        this.loadingSubject.next(false);
      }
    });
  }

  getResultByCedula(cedula: string): Person | undefined {
    return this.resultsSubject.value.find(r => r.cedula === cedula);
  }

  setResults(results: Person[]): void {
    console.log('📝 Updating results manually:', results);
    this.resultsSubject.next(results);
  }
}
