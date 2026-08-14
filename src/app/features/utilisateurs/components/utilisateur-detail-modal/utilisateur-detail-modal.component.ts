import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Utilisateur } from '../../models/utilisateur.model';
import { ProfileCreateResponse } from '../../../../core/models/profile.model';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { AvatarComponent } from '../../../../shared/ui/avatar/avatar';

@Component({
  selector: 'app-utilisateur-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, BadgeComponent, AvatarComponent, DatePipe],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Détails de l'Administrateur"
      subtitle="Fiche détaillée des informations de l'utilisateur"
      size="md"
      (close)="close.emit()"
    >
      @if (item(); as admin) {
        <div class="space-y-6 pt-2">
          <!-- Header Profile -->
          <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <app-avatar
              [alt]="admin.firstName + ' ' + admin.lastName"
              size="lg"
              variant="circle"
            ></app-avatar>

            <div>
              <h3 class="text-base font-bold text-slate-900">{{ admin.firstName }} {{ admin.lastName }}</h3>
              <p class="text-xs text-slate-500 font-mono">Code: {{ admin.code || admin.id }}</p>
              <div class="mt-1">
                @switch ((admin.status || '').toUpperCase()) {
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
                  @default {
                    <app-badge variant="neutral" size="sm" [dot]="true">Inactif</app-badge>
                  }
                }
              </div>
            </div>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="p-3 rounded-lg border border-slate-100 bg-white">
              <span class="text-xs font-medium text-slate-400">Email</span>
              <p class="font-semibold text-slate-800 break-all">{{ admin.email }}</p>
            </div>

            <div class="p-3 rounded-lg border border-slate-100 bg-white">
              <span class="text-xs font-medium text-slate-400">Téléphone</span>
              <p class="font-semibold text-slate-800">{{ admin.phone || 'Non renseigné' }}</p>
            </div>

            <div class="p-3 rounded-lg border border-slate-100 bg-white">
              <span class="text-xs font-medium text-slate-400">Profil / Rôle</span>
              <p class="font-semibold text-indigo-600">{{ getProfileLabel(admin.profileId) }}</p>
            </div>

            <div class="p-3 rounded-lg border border-slate-100 bg-white">
              <span class="text-xs font-medium text-slate-400">Date de création</span>
              <p class="font-semibold text-slate-800">{{ admin.createdAt ? (admin.createdAt | date: 'dd/MM/yyyy HH:mm') : 'Non renseigné' }}</p>
            </div>
          </div>
        </div>
      }
    </app-modal>
  `
})
export class UtilisateurDetailModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly item = input<Utilisateur | null>(null);
  readonly profiles = input<ProfileCreateResponse[]>([]);

  readonly close = output<void>();

  getProfileLabel(profileId?: string): string {
    if (!profileId) return 'Administrateur';
    const found = this.profiles().find(p => p.id === profileId);
    return found ? (found.label || found.code || 'Administrateur') : 'Administrateur';
  }
}
