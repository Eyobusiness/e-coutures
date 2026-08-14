import { Routes } from '@angular/router';

export const FORFAITS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/forfait-list-page/forfait-list-page.component').then(m => m.ForfaitListPageComponent)
  }
];
