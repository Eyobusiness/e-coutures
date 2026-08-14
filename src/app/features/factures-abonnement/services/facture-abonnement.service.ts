import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  FactureAbonnement,
  CreateFactureRequest,
  UpdateFactureRequest,
  PayFactureRequest,
  FacturesListResponse
} from '../models/facture-abonnement.model';

@Injectable({
  providedIn: 'root'
})
export class FactureAbonnementService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/subscription-invoices`;

  getAll(page: number = 1, limit: number = 10): Observable<FacturesListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<FacturesListResponse>(`${this.baseUrl}/all`, { params });
  }

  getById(id: string): Observable<FactureAbonnement> {
    return this.http.get<FactureAbonnement>(`${this.baseUrl}/${id}`);
  }

  getByAbonnement(abonnementId: string): Observable<FactureAbonnement[]> {
    return this.http.get<FactureAbonnement[]>(`${this.baseUrl}/subscription/${abonnementId}`);
  }

  create(payload: CreateFactureRequest): Observable<FactureAbonnement> {
    return this.http.post<FactureAbonnement>(this.baseUrl, payload);
  }

  payer(id: string, payload: PayFactureRequest): Observable<FactureAbonnement> {
    return this.http.post<FactureAbonnement>(`${this.baseUrl}/${id}/pay`, payload);
  }

  pay(id: string, payload: PayFactureRequest): Observable<FactureAbonnement> {
    return this.payer(id, payload);
  }

  update(id: string, payload: UpdateFactureRequest): Observable<FactureAbonnement> {
    return this.http.put<FactureAbonnement>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<FactureAbonnement> {
    return this.http.delete<FactureAbonnement>(`${this.baseUrl}/${id}`);
  }
}
