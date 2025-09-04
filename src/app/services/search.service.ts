// src/app/services/search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResponse, Person } from './search.types';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://127.0.0.1:5000/scrape'; // Flask Backend

  constructor(private http: HttpClient) {}

  // 🔹 Always POST to /scrape
  search(type: string, value: string): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(this.apiUrl, { type, value });
  }

    private results: Person[] = [];

    setResults(results: Person[]): void {
      this.results = results;
    }

    getResults(): Person[] {
      return this.results;
    }
    
  getResultByCedula(cedula: string): Person | undefined {
    return this.results.find(r => r.cedula === cedula);
  }
}
