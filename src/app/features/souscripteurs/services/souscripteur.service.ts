import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Souscripteur,
  CreateSouscripteurRequest,
  UpdateSouscripteurRequest,
  SouscripteursListResponse
} from '../models/souscripteur.model';
import { EnrollmentRequest, EnrollmentResponse } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class SouscripteurService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/account-holders`;
  private readonly fallbackUrl1 = `${environment.apiUrl}/api/v1/subscribers`;
  private readonly fallbackUrl2 = `${environment.apiUrl}/api/v1/souscripteurs`;

  getAll(page: number = 1, limit: number = 10): Observable<SouscripteursListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<SouscripteursListResponse>(`${this.baseUrl}/all`, { params }).pipe(
      catchError(() => {
        return this.http.get<SouscripteursListResponse>(`${this.fallbackUrl1}/all`, { params }).pipe(
          catchError(() => this.http.get<SouscripteursListResponse>(`${this.fallbackUrl2}/all`, { params }))
        );
      })
    );
  }

  getById(id: string): Observable<Souscripteur> {
    return this.http.get<Souscripteur>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => this.http.get<Souscripteur>(`${this.fallbackUrl1}/${id}`).pipe(
        catchError(() => this.http.get<Souscripteur>(`${this.fallbackUrl2}/${id}`))
      ))
    );
  }

  create(payload: CreateSouscripteurRequest): Observable<Souscripteur> {
    return this.http.post<Souscripteur>(this.baseUrl, payload).pipe(
      catchError(() => this.http.post<Souscripteur>(this.fallbackUrl1, payload).pipe(
        catchError(() => this.http.post<Souscripteur>(this.fallbackUrl2, payload))
      ))
    );
  }

  enroll(payload: EnrollmentRequest): Observable<EnrollmentResponse> {
    return this.http.post<EnrollmentResponse>(`${environment.apiUrl}/api/v1/admin/enrollments`, payload).pipe(
      catchError(() => this.http.post<EnrollmentResponse>(`${environment.apiUrl}/api/v1/enrollments`, payload))
    );
  }

  update(id: string, payload: UpdateSouscripteurRequest): Observable<Souscripteur> {
    return this.http.put<Souscripteur>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(() => this.http.put<Souscripteur>(`${this.fallbackUrl1}/${id}`, payload).pipe(
        catchError(() => this.http.put<Souscripteur>(`${this.fallbackUrl2}/${id}`, payload))
      ))
    );
  }

  delete(id: string): Observable<Souscripteur> {
    return this.http.delete<Souscripteur>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => this.http.delete<Souscripteur>(`${this.fallbackUrl1}/${id}`).pipe(
        catchError(() => this.http.delete<Souscripteur>(`${this.fallbackUrl2}/${id}`))
      ))
    );
  }
}
