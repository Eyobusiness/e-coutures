import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';
import { generateHmacHeaders } from '../utils/hmac.utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const secret = environment.hmacSecret || 'ecouture-dev-hmac-secret-change-me';

  const isApiUrl = !environment.apiUrl ||
                   req.url.startsWith(environment.apiUrl) ||
                   req.url.startsWith('/api') ||
                   !req.url.startsWith('http');

  const hmacPromise = isApiUrl
    ? generateHmacHeaders(req.method, req.urlWithParams, req.body, secret, timestamp)
    : Promise.resolve({});

  return from(hmacPromise).pipe(
    switchMap((hmacHeaders) => {
      const headersToAdd: Record<string, string> = {
        ...hmacHeaders
      };

      if (token && isApiUrl) {
        const cleanToken = token.trim();
        headersToAdd['Authorization'] = cleanToken.startsWith('Bearer ')
          ? cleanToken
          : `Bearer ${cleanToken}`;
      }

      const authReq = req.clone({
        setHeaders: headersToAdd
      });

      return next(authReq);
    })
  );
};
