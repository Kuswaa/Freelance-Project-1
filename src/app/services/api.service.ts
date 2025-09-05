import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient, private searchService: SearchService) {}

  /** 🔗 Fetch full details of a person by cedula */
  getDetails(cedula: string): Observable<any> {
  const result = this.searchService.getResultByCedula(cedula);

  if (!result || !result.link) {
    console.error(`❌ Result or URL not found for cedula: ${cedula}`);
    // Throw an observable error instead of using result.link directly
    return throwError(() => new Error('Result or URL not found for cedula: ' + cedula));
  }

  console.log(`🚀 Fetching details for cedula: ${cedula} | url: ${result.link}`);
  
  return this.http.post<any>(`${this.baseUrl}/details`, { url: result.link }).pipe(
    catchError(err => {
      console.error('❌ Error in getDetails:', err);
      return throwError(() => err);
    })
  );
}

}
