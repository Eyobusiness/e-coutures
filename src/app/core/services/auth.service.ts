import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import {
  LoginAdminRequest,
  AuthAdminResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyPasswordRequest,
  PasswordApiResponse
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private readonly USER_KEY = 'digitcouture_user_data';

  currentUser = signal<AuthAdminResponse | null>(this.getStoredUser());

  loginAdmin(credentials: LoginAdminRequest): Observable<AuthAdminResponse> {
    const url = `${environment.apiUrl}/api/v1/auth/admin`;
    return this.http.post<any>(url, credentials).pipe(
      tap((raw: any) => {
        const token = raw?.token ||
                      raw?.accessToken ||
                      raw?.access_token ||
                      raw?.jwt ||
                      raw?.data?.token ||
                      raw?.data?.accessToken ||
                      raw?.data?.jwt;

        const refresh = raw?.refresh ||
                        raw?.refreshToken ||
                        raw?.refresh_token ||
                        raw?.data?.refresh ||
                        raw?.data?.refreshToken;

        if (token) {
          this.tokenService.setToken(token);
        }
        if (refresh) {
          this.tokenService.setRefreshToken(refresh);
        }
      }),
      map((res: any) => {
        const payload = (res && res.data && typeof res.data === 'object' && res.data.token)
          ? res.data
          : (res?.data || res);
        return payload as AuthAdminResponse;
      }),
      tap((user: AuthAdminResponse) => {
        this.setUser(user);
      })
    );
  }

  refreshSession(): Observable<AuthAdminResponse> {
    const refresh = this.tokenService.getRefreshToken() || '';
    const url = `${environment.apiUrl}/api/v1/auth/admin/refresh`;
    return this.http.post<any>(url, { refreshToken: refresh }).pipe(
      tap((raw: any) => {
        const token = raw?.token ||
                      raw?.accessToken ||
                      raw?.access_token ||
                      raw?.jwt ||
                      raw?.data?.token ||
                      raw?.data?.accessToken;

        const newRefresh = raw?.refresh ||
                           raw?.refreshToken ||
                           raw?.refresh_token ||
                           raw?.data?.refresh ||
                           raw?.data?.refreshToken;

        if (token) {
          this.tokenService.setToken(token);
        }
        if (newRefresh) {
          this.tokenService.setRefreshToken(newRefresh);
        }
      }),
      map((res: any) => {
        const payload = (res && res.data && typeof res.data === 'object' && res.data.token)
          ? res.data
          : (res?.data || res);
        return payload as AuthAdminResponse;
      }),
      tap((user: AuthAdminResponse) => {
        this.setUser(user);
      })
    );
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<PasswordApiResponse> {
    const url = `${environment.apiUrl}/api/v1/password/admin/forgot`;
    return this.http.post<PasswordApiResponse>(url, payload);
  }

  verifyPasswordToken(payload: VerifyPasswordRequest): Observable<PasswordApiResponse> {
    const url = `${environment.apiUrl}/api/v1/password/admin/verification`;
    return this.http.post<PasswordApiResponse>(url, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<PasswordApiResponse> {
    const url = `${environment.apiUrl}/api/v1/password/admin/reset`;
    return this.http.put<PasswordApiResponse>(url, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<PasswordApiResponse> {
    const url = `${environment.apiUrl}/api/v1/password/admin/change`;
    return this.http.put<PasswordApiResponse>(url, payload);
  }

  logout(): void {
    this.tokenService.clearTokens();
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setUser(user: AuthAdminResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredUser(): AuthAdminResponse | null {
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as AuthAdminResponse;
    } catch {
      return null;
    }
  }
}
