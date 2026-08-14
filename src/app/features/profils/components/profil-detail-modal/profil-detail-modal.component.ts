import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ProfileCreateResponse } from '../../../../core/models/profile.model';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';

@Component({
  selector: 'app-profil-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, BadgeComponent],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Détails du Profil & Habilitations"
      subtitle="Permissions et accès accordés à ce profil"
      size="md"
      (close)="close.emit()"
    >
      @if (item(); as profil) {
        <div class="space-y-6 pt-2">
          <!-- Header Profile -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">{{ profil.label }}</h3>
              <p class="text-xs text-slate-500 font-mono">Code: {{ profil.profileCode || profil.code || profil.id }}</p>
            </div>

            <div>
              @switch ((profil.status || '').toUpperCase()) {
                @case ('ACTIVATED') {
                  <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                }
                @case ('ACTIF') {
                  <app-badge variant="success" size="sm" [dot]="true">Actif</app-badge>
                }
                @default {
                  <app-badge variant="danger" size="sm" [dot]="true">Inactif</app-badge>
                }
              }
            </div>
          </div>

          <!-- Menus / Permissions -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Menus & Habilitations autorisés</h4>

            <div class="rounded-xl border border-slate-200 divide-y divide-slate-100 max-h-60 overflow-y-auto">
              @if (profil.menus && profil.menus.length > 0) {
                @for (menu of profil.menus; track menu.id || menu.label) {
                  <div class="p-3 bg-white space-y-1">
                    <div class="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                      <i [class]="menu.icon || 'ti ti-category'" class="text-indigo-600"></i>
                      <span>{{ menu.label || menu.code }}</span>
                    </div>

                    @if (menu.subMenus && menu.subMenus.length > 0) {
                      <div class="ml-6 flex flex-wrap gap-1 pt-1">
                        @for (sub of menu.subMenus; track sub.id || sub.label) {
                          <span class="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {{ sub.label }}
                          </span>
                        }
                      </div>
                    }
                  </div>
                }
              } @else {
                <p class="p-4 text-center text-xs text-slate-400 italic">
                  Aucun menu configuré pour ce profil.
                </p>
              }
            </div>
          </div>
        </div>
      }
    </app-modal>
  `
})
export class ProfilDetailModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly item = input<ProfileCreateResponse | null>(null);

  readonly close = output<void>();
}
