import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  protected getUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  get<T>(endpoint: string, params?: Record<string, any>): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<T>>(this.getUrl(endpoint), { params: httpParams });
  }

  getPaginated<T>(endpoint: string, page: number = 1, pageSize: number = 10, filters?: Record<string, any>): Observable<ApiResponse<PaginatedResponse<T>>> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters
    };
    return this.get<PaginatedResponse<T>>(endpoint, params);
  }

  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.getUrl(endpoint), body);
  }

  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.getUrl(endpoint), body);
  }

  patch<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.getUrl(endpoint), body);
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.getUrl(endpoint));
  }
}
