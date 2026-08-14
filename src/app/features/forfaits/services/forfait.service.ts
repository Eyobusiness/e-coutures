import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Forfait,
  CreateForfaitRequest,
  UpdateForfaitRequest,
  ForfaitsListResponse
} from '../models/forfait.model';

@Injectable({
  providedIn: 'root'
})
export class ForfaitService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/plans`;
  private readonly fallbackUrl = `${environment.apiUrl}/api/v1/forfaits`;

  getAll(page: number = 1, limit: number = 10): Observable<ForfaitsListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ForfaitsListResponse>(`${this.baseUrl}/all`, { params }).pipe(
      catchError(() => {
        return this.http.get<ForfaitsListResponse>(`${this.fallbackUrl}/all`, { params });
      })
    );
  }

  getById(id: string): Observable<Forfait> {
    return this.http.get<Forfait>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => this.http.get<Forfait>(`${this.fallbackUrl}/${id}`))
    );
  }

  create(payload: CreateForfaitRequest): Observable<Forfait> {
    return this.http.post<Forfait>(this.baseUrl, payload).pipe(
      catchError(() => this.http.post<Forfait>(this.fallbackUrl, payload))
    );
  }

  update(id: string, payload: UpdateForfaitRequest): Observable<Forfait> {
    return this.http.put<Forfait>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(() => this.http.put<Forfait>(`${this.fallbackUrl}/${id}`, payload))
    );
  }

  delete(id: string): Observable<Forfait> {
    return this.http.delete<Forfait>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => this.http.delete<Forfait>(`${this.fallbackUrl}/${id}`))
    );
  }
}
