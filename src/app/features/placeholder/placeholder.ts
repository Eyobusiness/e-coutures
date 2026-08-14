import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60dvh] px-4 text-center">
      <div class="bg-blue-50 text-blue-600 p-4 rounded-full mb-6 animate-pulse">
        <i class="ti ti-settings-automation text-5xl"></i>
      </div>
      <h1 class="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
        Fonctionnalité en cours de préparation
      </h1>
      <p class="text-slate-500 max-w-md mb-8 text-lg">
        L'onglet <span class="font-semibold text-blue-600">{{ pageName() }}</span> sera disponible très prochainement avec l'intégration des APIs de Digitcouture.
      </p>
      
      <div class="bg-white border border-slate-100 shadow-lg shadow-slate-100/50 rounded-2xl p-6 max-w-lg w-full text-left space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Ce qui arrive bientôt :</h3>
        <div class="flex items-start gap-3">
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold shrink-0">✓</span>
          <p class="text-slate-600 text-sm font-medium">Synchronisation des données en temps réel via API REST</p>
        </div>
        <div class="flex items-start gap-3">
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold shrink-0">✓</span>
          <p class="text-slate-600 text-sm font-medium">Tableaux de données interactifs et exports de rapports</p>
        </div>
        <div class="flex items-start gap-3">
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold shrink-0">✓</span>
          <p class="text-slate-600 text-sm font-medium">Gestion avancée des droits d'accès</p>
        </div>
      </div>
      
      <button (click)="goHome()" class="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.03] duration-200 cursor-pointer">
        Retour à l'accueil
      </button>
    </div>
  `
})
export class PlaceholderComponent {
  private router = inject(Router);

  pageName = computed(() => {
    const url = this.router.url;
    if (url.includes('souscription')) return 'Souscripteurs';
    if (url.includes('abonnement')) return 'Abonnements';
    if (url.includes('abonnes')) return 'Abonnés';
    if (url.includes('utilisateur')) return 'Utilisateurs';
    if (url.includes('profils')) return 'Profils';
    if (url.includes('settings')) return 'Paramètres Systèmes';
    return 'cette page';
  });

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
