import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inattendue s\'est produite.';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        if (error.status === 401) {
          const isAuthEndpoint = req.url.includes('/auth/') || req.url.includes('/login');
          // Only clear tokens and force logout if 401 happens on explicit auth login endpoint
          if (isAuthEndpoint) {
            tokenService.clearTokens();
          } else {
            // Show warning for feature 401 errors without logging the user out of the application
            toastService.warning('Données indisponibles ou session temporairement non autorisée.', 'Accès non autorisé');
          }
        } else if (error.status === 403) {
          toastService.error('Vous n\'avez pas les permissions requises pour cette action.', 'Accès refusé');
        } else if (error.status === 404) {
          errorMessage = error.error?.message || 'La ressource demandée est introuvable.';
          toastService.warning(errorMessage, 'Non trouvé');
        } else if (error.status === 422 || error.status === 400) {
          errorMessage = error.error?.message || 'Données invalides fournies.';
          toastService.error(errorMessage, 'Erreur de validation');
        } else if (error.status >= 500) {
          toastService.error('Erreur du serveur. Nos équipes ont été notifiées.', 'Erreur Serveur');
        }
      }

      return throwError(() => error);
    })
  );
};
