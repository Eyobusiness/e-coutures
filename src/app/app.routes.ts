import { Routes } from '@angular/router';
import { Main } from './shared/layouts/main/main';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: Main,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/routes/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'souscription',
        loadChildren: () => import('./features/souscripteurs/routes/souscripteurs.routes').then(m => m.SOUSCRIPTEURS_ROUTES)
      },
      {
        path: 'abonnement',
        loadChildren: () => import('./features/abonnements/routes/abonnements.routes').then(m => m.ABONNEMENTS_ROUTES)
      },
      {
        path: 'factures',
        loadChildren: () => import('./features/factures-abonnement/routes/factures-abonnement.routes').then(m => m.FACTURES_ABONNEMENT_ROUTES)
      },
      {
        path: 'forfaits',
        loadChildren: () => import('./features/forfaits/routes/forfaits.routes').then(m => m.FORFAITS_ROUTES)
      },
      {
        path: 'rapports',
        loadChildren: () => import('./features/rapports/routes/rapports.routes').then(m => m.RAPPORTS_ROUTES)
      },
      {
        path: 'carte-cadastrale',
        loadChildren: () => import('./features/cartes/routes/cartes.routes').then(m => m.CARTES_ROUTES)
      },
      {
        path: 'utilisateur',
        loadChildren: () => import('./features/utilisateurs/routes/utilisateurs.routes').then(m => m.UTILISATEURS_ROUTES)
      },
      {
        path: 'profils',
        loadChildren: () => import('./features/profils/routes/profils.routes').then(m => m.PROFILS_ROUTES)
      },
      {
        path: 'mon-profil',
        loadComponent: () => import('./features/auth/pages/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/placeholder/placeholder').then(m => m.PlaceholderComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
