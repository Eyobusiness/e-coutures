import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from '../models/api-response.model';
import { ProfileCreateRequest, ProfileCreateResponse } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseApiService {
  private readonly endpoint = '/api/v1/profiles';

  getProfiles(): Observable<ApiResponse<ProfileCreateResponse[]>> {
    return this.get<ProfileCreateResponse[]>(this.endpoint);
  }

  getProfileById(id: string): Observable<ApiResponse<ProfileCreateResponse>> {
    return this.get<ProfileCreateResponse>(`${this.endpoint}/${id}`);
  }

  createProfile(payload: ProfileCreateRequest): Observable<ApiResponse<ProfileCreateResponse>> {
    return this.post<ProfileCreateResponse>(this.endpoint, payload);
  }

  updateProfile(id: string, payload: Partial<ProfileCreateRequest>): Observable<ApiResponse<ProfileCreateResponse>> {
    return this.put<ProfileCreateResponse>(`${this.endpoint}/${id}`, payload);
  }

  deleteProfile(id: string): Observable<ApiResponse<ProfileCreateResponse>> {
    return this.delete<ProfileCreateResponse>(`${this.endpoint}/${id}`);
  }
}
