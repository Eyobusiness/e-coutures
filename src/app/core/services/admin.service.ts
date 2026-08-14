import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { AdminCreateRequest, AdminUpdateRequest, AdminResponse } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseApiService {
  private readonly endpoint = '/api/v1/admins';

  getAllAdmins(): Observable<ApiResponse<AdminResponse[]>> {
    return this.get<AdminResponse[]>(`${this.endpoint}/all`);
  }

  getAdmins(page: number = 1, pageSize: number = 10, filters?: Record<string, any>): Observable<ApiResponse<PaginatedResponse<AdminResponse>>> {
    return this.getPaginated<AdminResponse>(this.endpoint, page, pageSize, filters);
  }

  getAdminById(id: string): Observable<ApiResponse<AdminResponse>> {
    return this.get<AdminResponse>(`${this.endpoint}/${id}`);
  }

  createAdmin(payload: AdminCreateRequest): Observable<ApiResponse<AdminResponse>> {
    return this.post<AdminResponse>(this.endpoint, payload);
  }

  updateAdmin(id: string, payload: AdminUpdateRequest): Observable<ApiResponse<AdminResponse>> {
    return this.put<AdminResponse>(`${this.endpoint}/${id}`, payload);
  }

  deleteAdmin(id: string): Observable<ApiResponse<AdminResponse>> {
    return this.delete<AdminResponse>(`${this.endpoint}/${id}`);
  }
}
