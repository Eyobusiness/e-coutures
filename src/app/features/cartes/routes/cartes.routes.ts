import { Routes } from '@angular/router';

export const CARTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/carte-cadastrale-page/carte-cadastrale-page.component').then(m => m.CarteCadastralePageComponent)
  }
];
