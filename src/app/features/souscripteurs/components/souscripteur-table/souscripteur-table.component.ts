import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Souscripteur } from '../../models/souscripteur.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-souscripteur-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <div class="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <table class="w-full text-left text-sm border-collapse">
        <thead class="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/80">
          <tr>
            <th class="py-3.5 px-4">Matricule</th>
            <th class="py-3.5 px-4">Nom Complet</th>
            <th class="py-3.5 px-4">Contact</th>
            <th class="py-3.5 px-4">Pays / Devise</th>
            <th class="py-3.5 px-4">Abonnement</th>
            <th class="py-3.5 px-4">Statut</th>
            <th class="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          @for (item of items(); track item.id) {
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-mono font-semibold text-pantone-navy text-xs">
                {{ item.matricule || item.id.substring(0, 8) }}
              </td>

              <td class="py-3.5 px-4">
                <div class="font-semibold text-slate-900">{{ item.nomComplet }}</div>
              </td>

              <td class="py-3.5 px-4 space-y-0.5">
                <div class="flex items-center gap-1.5 text-xs text-slate-700">
                  <i class="ti ti-mail text-slate-400"></i>
                  <span>{{ item.email }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-500">
                  <i class="ti ti-phone text-slate-400"></i>
                  <span>{{ item.telephone }}</span>
                </div>
              </td>

              <td class="py-3.5 px-4">
                <div class="font-medium text-slate-800">{{ item.pays }}</div>
                <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {{ item.devise }}
                </span>
              </td>

              <td class="py-3.5 px-4">
                @if (item.abonnementNom) {
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <i class="ti ti-box text-xs"></i> {{ item.abonnementNom }}
                  </span>
                } @else {
                  <span class="text-xs text-slate-400 italic">Aucun abonnement</span>
                }
              </td>

              <td class="py-3.5 px-4">
                @switch (item.statut.toLowerCase()) {
                  @case ('actif') {
                    <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                  }
                  @case ('suspendu') {
                    <app-badge variant="danger" size="sm" [dot]="true">Suspendu</app-badge>
                  }
                  @default {
                    <app-badge variant="neutral" size="sm" [dot]="true">Inactif</app-badge>
                  }
                }
              </td>

              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <app-button
                    type="button"
                    variant="ghost"
                    size="sm"
                    [iconOnly]="true"
                    iconLeft="ti ti-link"
                    (btnClick)="link.emit(item)"
                    title="Lier un abonnement"
                  ></app-button>

                  <app-button
                    type="button"
                    variant="ghost"
                    size="sm"
                    [iconOnly]="true"
                    iconLeft="ti ti-eye"
                    (btnClick)="view.emit(item)"
                    title="Voir détails"
                  ></app-button>

                  <app-button
                    type="button"
                    variant="ghost"
                    size="sm"
                    [iconOnly]="true"
                    iconLeft="ti ti-pencil"
                    (btnClick)="edit.emit(item)"
                    title="Modifier"
                  ></app-button>

                  <app-button
                    type="button"
                    variant="ghost"
                    size="sm"
                    [iconOnly]="true"
                    iconLeft="ti ti-trash"
                    (btnClick)="delete.emit(item)"
                    title="Supprimer"
                  ></app-button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="7" class="py-8 text-center">
                <app-empty-state
                  title="Aucun souscripteur enregistré"
                  description="Cliquez sur le bouton ci-dessus pour ajouter votre premier souscripteur."
                  icon="ti ti-users-minus"
                ></app-empty-state>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class SouscripteurTableComponent {
  readonly items = input<Souscripteur[]>([]);

  readonly view = output<Souscripteur>();
  readonly edit = output<Souscripteur>();
  readonly link = output<Souscripteur>();
  readonly delete = output<Souscripteur>();
}
