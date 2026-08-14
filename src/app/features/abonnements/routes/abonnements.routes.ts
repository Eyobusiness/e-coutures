import { Routes } from '@angular/router';

export const ABONNEMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/abonnement-list-page/abonnement-list-page.component').then(m => m.AbonnementListPageComponent)
  }
];
