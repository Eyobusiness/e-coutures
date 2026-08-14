import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RapportExportParams } from '../models/rapport.model';

@Injectable({
  providedIn: 'root'
})
export class RapportService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/rapports`;

  getEntities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/entities`);
  }

  downloadPdf(params?: RapportExportParams): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params?.entity) {
      httpParams = httpParams.set('entity', params.entity);
    }
    if (params?.dateDebut) {
      httpParams = httpParams.set('dateDebut', params.dateDebut);
    }
    if (params?.dateFin) {
      httpParams = httpParams.set('dateFin', params.dateFin);
    }

    return this.http.get(`${this.baseUrl}/pdf`, {
      params: httpParams,
      responseType: 'blob'
    });
  }

  downloadExcel(params?: RapportExportParams): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params?.entity) {
      httpParams = httpParams.set('entity', params.entity);
    }
    if (params?.dateDebut) {
      httpParams = httpParams.set('dateDebut', params.dateDebut);
    }
    if (params?.dateFin) {
      httpParams = httpParams.set('dateFin', params.dateFin);
    }

    return this.http.get(`${this.baseUrl}/excel`, {
      params: httpParams,
      responseType: 'blob'
    });
  }
}
