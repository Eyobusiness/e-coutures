import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CouturierCarteItem,
  CouturierCarteDetail,
  AtelierCarteItem
} from '../models/carte.model';

@Injectable({
  providedIn: 'root'
})
export class CarteService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/admin/maps`;

  getCouturiers(): Observable<CouturierCarteItem[]> {
    return this.http.get<CouturierCarteItem[]>(`${this.baseUrl}/tailors`);
  }

  getCouturierDetail(employeId: string): Observable<CouturierCarteDetail> {
    return this.http.get<CouturierCarteDetail>(`${this.baseUrl}/tailors/${employeId}`);
  }

  getAteliers(): Observable<AtelierCarteItem[]> {
    return this.http.get<AtelierCarteItem[]>(`${this.baseUrl}/workshops`);
  }
}
