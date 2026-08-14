import { Routes } from '@angular/router';

export const RAPPORTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/rapport-list/rapport-list').then(m => m.RapportList)
  }
];
