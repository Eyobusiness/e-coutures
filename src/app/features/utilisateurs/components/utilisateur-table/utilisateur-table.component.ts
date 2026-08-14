import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AdminResponse } from '../../../../core/models/admin.model';
import { ProfileCreateResponse } from '../../../../core/models/profile.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-utilisateur-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <div class="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <table class="w-full text-left text-sm border-collapse">
        <thead class="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/80">
          <tr>
            <th class="py-3.5 px-4">Code</th>
            <th class="py-3.5 px-4">Administrateur</th>
            <th class="py-3.5 px-4">Coordonnées</th>
            <th class="py-3.5 px-4">Profil</th>
            <th class="py-3.5 px-4">Statut</th>
            <th class="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          @for (item of items(); track item.id) {
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-mono font-semibold text-indigo-600 text-xs">
                {{ item.code || (item.id ? item.id.substring(0, 8) : 'ADM') }}
              </td>

              <td class="py-3.5 px-4">
                <div class="font-semibold text-slate-900">{{ item.firstName }} {{ item.lastName }}</div>
              </td>

              <td class="py-3.5 px-4 space-y-0.5">
                <div class="flex items-center gap-1.5 text-xs text-slate-700">
                  <i class="ti ti-mail text-slate-400"></i>
                  <span>{{ item.email }}</span>
                </div>
                @if (item.phone) {
                  <div class="flex items-center gap-1.5 text-xs text-slate-500">
                    <i class="ti ti-phone text-slate-400"></i>
                    <span>{{ item.phone }}</span>
                  </div>
                }
              </td>

              <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  <i class="ti ti-user-shield text-indigo-500 text-xs"></i>
                  {{ getProfileLabel(item.profileId) }}
                </span>
              </td>

              <td class="py-3.5 px-4">
                @switch ((item.status || '').toUpperCase()) {
                  @case ('ACTIVATED') {
                    <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                  }
                  @case ('ACTIVE') {
                    <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                  }
                  @case ('ACTIF') {
                    <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                  }
                  @case ('ENABLED') {
                    <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                  }
                  @case ('INACTIVATED') {
                    <app-badge variant="neutral" size="sm" [dot]="true">Inactif</app-badge>
                  }
                  @case ('INACTIVE') {
                    <app-badge variant="neutral" size="sm" [dot]="true">Inactif</app-badge>
                  }
                  @case ('INACTIF') {
                    <app-badge variant="neutral" size="sm" [dot]="true">Inactif</app-badge>
                  }
                  @case ('DISABLED') {
                    <app-badge variant="neutral" size="sm" [dot]="true">Inactif</app-badge>
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
              <td colspan="6" class="py-8 text-center">
                <app-empty-state
                  title="Aucun administrateur trouvé"
                  description="Cliquez sur le bouton ci-dessus pour ajouter un nouvel utilisateur administrateur."
                  icon="ti ti-users"
                ></app-empty-state>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class UtilisateurTableComponent {
  readonly items = input<AdminResponse[]>([]);
  readonly profiles = input<ProfileCreateResponse[]>([]);

  readonly view = output<AdminResponse>();
  readonly edit = output<AdminResponse>();
  readonly delete = output<AdminResponse>();

  getProfileLabel(profileId?: string): string {
    if (!profileId) return 'Administrateur';
    const found = this.profiles().find(p => p.id === profileId);
    return found ? (found.label || found.code || 'Administrateur') : 'Administrateur';
  }
}
