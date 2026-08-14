// @vitest-environment jsdom
import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { runInInjectionContext, Injector } from '@angular/core';
import { of, firstValueFrom } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';

describe('AuthInterceptor', () => {
  let tokenService: TokenService;
  let customInjector: Injector;

  beforeEach(() => {
    tokenService = new TokenService();
    tokenService.clearTokens();

    customInjector = {
      get(token: unknown) {
        if (token === TokenService) {
          return tokenService;
        }
        return null;
      }
    } as Injector;
  });

  it('should add X-EC-Timestamp and X-EC-Signature headers to request', async () => {
    const req = new HttpRequest('GET', `${environment.apiUrl}/api/v1/subscribers`);
    let interceptedReq: HttpRequest<unknown> | null = null;

    const next: HttpHandlerFn = (r) => {
      interceptedReq = r;
      return of(new HttpResponse({ status: 200 }));
    };

    await firstValueFrom(runInInjectionContext(customInjector, () => authInterceptor(req, next)));

    expect(interceptedReq).not.toBeNull();
    expect(interceptedReq!.headers.has('X-EC-Timestamp')).toBe(true);
    expect(interceptedReq!.headers.has('X-EC-Signature')).toBe(true);
    expect(interceptedReq!.headers.has('Authorization')).toBe(false);
  });

  it('should add Authorization Bearer header when token is present', async () => {
    tokenService.setToken('mock-jwt-token-123');
    const req = new HttpRequest('POST', `${environment.apiUrl}/api/v1/auth/admin`, {
      email: 'admin@digit.local'
    });
    let interceptedReq: HttpRequest<unknown> | null = null;

    const next: HttpHandlerFn = (r) => {
      interceptedReq = r;
      return of(new HttpResponse({ status: 200 }));
    };

    await firstValueFrom(runInInjectionContext(customInjector, () => authInterceptor(req, next)));

    expect(interceptedReq).not.toBeNull();
    expect(interceptedReq!.headers.has('X-EC-Timestamp')).toBe(true);
    expect(interceptedReq!.headers.has('X-EC-Signature')).toBe(true);
    expect(interceptedReq!.headers.get('Authorization')).toBe('Bearer mock-jwt-token-123');
  });
});
