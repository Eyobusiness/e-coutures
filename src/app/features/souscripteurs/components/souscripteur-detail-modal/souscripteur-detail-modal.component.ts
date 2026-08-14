import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Souscripteur } from '../../models/souscripteur.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-souscripteur-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, BadgeComponent, ButtonComponent],
  template: `
    @if (isOpen() && item(); as souscripteur) {
      <div
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        role="dialog"
        aria-modal="true"
        (click)="onBackdropClick($event)"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-scale-up space-y-6 overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-pantone-navy/10 text-pantone-navy flex items-center justify-center font-bold text-lg">
                <i class="ti ti-id"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">
                  {{ souscripteur.nomComplet }}
                </h2>
                <p class="text-xs text-slate-400 font-mono">
                  Matricule : {{ souscripteur.matricule || souscripteur.id }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              (click)="close.emit()"
            >
              <i class="ti ti-x text-lg"></i>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl space-y-1">
              <span class="text-slate-400 font-medium">Email</span>
              <div class="font-semibold text-slate-800 break-all">{{ souscripteur.email }}</div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl space-y-1">
              <span class="text-slate-400 font-medium">Téléphone</span>
              <div class="font-semibold text-slate-800">{{ souscripteur.telephone }}</div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl space-y-1">
              <span class="text-slate-400 font-medium">Pays</span>
              <div class="font-semibold text-slate-800">{{ souscripteur.pays }}</div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl space-y-1">
              <span class="text-slate-400 font-medium">Devise</span>
              <div class="font-semibold text-slate-800">{{ souscripteur.devise }}</div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl space-y-1">
              <span class="text-slate-400 font-medium">Statut</span>
              <div>
                @switch (souscripteur.statut.toLowerCase()) {
                  @case ('actif') { <app-badge variant="success" size="sm">Actif</app-badge> }
                  @case ('suspendu') { <app-badge variant="danger" size="sm">Suspendu</app-badge> }
                  @default { <app-badge variant="neutral" size="sm">Inactif</app-badge> }
                }
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl space-y-1">
              <span class="text-slate-400 font-medium">Créé le</span>
              <div class="font-semibold text-slate-800">
                {{ souscripteur.createdAt ? (souscripteur.createdAt | date: 'dd/MM/yyyy HH:mm') : 'N/A' }}
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-100">
            <app-button
              type="button"
              variant="ghost"
              (btnClick)="close.emit()"
            >
              Fermer
            </app-button>
          </div>
        </div>
      </div>
    }
  `
})
export class SouscripteurDetailModalComponent {
  isOpen = input<boolean>(false);
  item = input<Souscripteur | null>(null);

  close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
