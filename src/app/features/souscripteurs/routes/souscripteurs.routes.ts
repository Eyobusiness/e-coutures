import { Routes } from '@angular/router';

export const SOUSCRIPTEURS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/souscripteurs-list-page/souscripteurs-list-page.component').then(m => m.SouscripteursListPageComponent)
  }
];
