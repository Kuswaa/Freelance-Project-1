import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = "http://127.0.0.1:5000/scrape";
  private results: any[] = []; // store search results

  constructor(private http: HttpClient) {}

  // Call backend API
  search(query: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, query);
  }

  // Save results locally
  setResults(results: any[]): void {
    this.results = results;
  }

  // Retrieve stored results
  getResults(): any[] {
    return this.results;
  }
}
