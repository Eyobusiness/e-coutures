import { Routes } from '@angular/router';

export const PROFILS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/profils-list-page/profils-list-page.component').then(m => m.ProfilsListPageComponent)
  }
];
