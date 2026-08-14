import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Abonnement,
  CreateAbonnementRequest,
  UpdateAbonnementRequest,
  AbonnementsListResponse
} from '../models/abonnement.model';

@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/subscriptions`;

  getAll(page: number = 1, limit: number = 10): Observable<AbonnementsListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<AbonnementsListResponse>(`${this.baseUrl}/all`, { params });
  }

  getById(id: string): Observable<Abonnement> {
    return this.http.get<Abonnement>(`${this.baseUrl}/${id}`);
  }

  getBySouscripteur(souscripteurId: string): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(`${this.baseUrl}/account-holder/${souscripteurId}`);
  }

  create(payload: CreateAbonnementRequest): Observable<Abonnement> {
    return this.http.post<Abonnement>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdateAbonnementRequest): Observable<Abonnement> {
    return this.http.put<Abonnement>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<Abonnement> {
    return this.http.delete<Abonnement>(`${this.baseUrl}/${id}`);
  }
}
