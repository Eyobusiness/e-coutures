import { Routes } from '@angular/router';

export const FACTURES_ABONNEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/facture-list-page/facture-list-page.component').then(m => m.FactureListPageComponent)
  }
];
