import { Routes } from '@angular/router';

export const PAIEMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/paiements-list-page/paiements-list-page.component').then(m => m.PaiementsListPageComponent)
  }
];
