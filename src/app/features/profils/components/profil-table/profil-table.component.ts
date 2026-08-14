import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ProfileCreateResponse } from '../../../../core/models/profile.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-profil-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <div class="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <table class="w-full text-left text-sm border-collapse">
        <thead class="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/80">
          <tr>
            <th class="py-3.5 px-4">Code Profil</th>
            <th class="py-3.5 px-4">Libellé</th>
            <th class="py-3.5 px-4">Menus Accessibles</th>
            <th class="py-3.5 px-4">Statut</th>
            <th class="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          @for (item of items(); track item.id) {
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-mono font-semibold text-indigo-600 text-xs">
                {{ item.profileCode || item.code || item.id.substring(0, 8) }}
              </td>

              <td class="py-3.5 px-4">
                <div class="font-semibold text-slate-900">{{ item.label }}</div>
              </td>

              <td class="py-3.5 px-4">
                <div class="flex flex-wrap gap-1 max-w-md">
                  @if (item.menus && item.menus.length > 0) {
                    @for (menu of item.menus.slice(0, 4); track menu.id || menu.label) {
                      <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                        <i class="ti ti-check text-[10px]"></i> {{ menu.label || menu.code }}
                      </span>
                    }
                    @if (item.menus.length > 4) {
                      <span class="inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        +{{ item.menus.length - 4 }} autre(s)
                      </span>
                    }
                  } @else {
                    <span class="text-xs text-slate-400 italic">Aucun menu attribué</span>
                  }
                </div>
              </td>

              <td class="py-3.5 px-4">
                @switch ((item.status || '').toUpperCase()) {
                  @case ('ACTIVATED') {
                    <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                  }
                  @case ('ACTIF') {
                    <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                  }
                  @case ('INACTIVATED') {
                    <app-badge variant="danger" size="sm" [dot]="true">Inactif</app-badge>
                  }
                  @default {
                    <app-badge variant="neutral" size="sm" [dot]="true">{{ item.status || 'Inconnu' }}</app-badge>
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
              <td colspan="5" class="py-8 text-center">
                <app-empty-state
                  title="Aucun profil enregistré"
                  description="Cliquez sur le bouton ci-dessus pour ajouter votre premier profil d'habilitation."
                  icon="ti ti-user-shield"
                ></app-empty-state>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ProfilTableComponent {
  readonly items = input<ProfileCreateResponse[]>([]);

  readonly view = output<ProfileCreateResponse>();
  readonly edit = output<ProfileCreateResponse>();
  readonly delete = output<ProfileCreateResponse>();
}
