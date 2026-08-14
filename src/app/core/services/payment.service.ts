import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Payment,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  PaymentsListResponse
} from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/payments`;

  getAll(page: number = 1, limit: number = 10): Observable<PaymentsListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaymentsListResponse>(`${this.baseUrl}/all`, { params });
  }

  getById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdatePaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<Payment> {
    return this.http.delete<Payment>(`${this.baseUrl}/${id}`);
  }
}
