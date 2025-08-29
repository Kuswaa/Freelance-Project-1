// src/app/services/scraper.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScrapeResult {
  cedula: string;
  name: string;
  link: string;
}

export interface ScrapeResponse {
  query_type: string;
  query_value: string;
  results: ScrapeResult[];
}

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  private backendUrl = 'http://127.0.0.1:5000/scrape';

  constructor(private http: HttpClient) {}

  scrape(queryType: string, queryValue: string): Observable<ScrapeResponse> {
    const body = { type: queryType, value: queryValue };
    return this.http.post<ScrapeResponse>(this.backendUrl, body);
  }
}
