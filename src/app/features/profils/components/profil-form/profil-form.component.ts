import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
  OnChanges,
  SimpleChanges,
  signal,
  computed
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ProfileCreateResponse,
  ProfileCreateRequest,
  ProfileMenuCreateRequest,
  PermissionLevel
} from '../../../../core/models/profile.model';
import { MenuResponse } from '../../../../core/models/menu.model';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { InputComponent } from '../../../../shared/ui/input/input';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { ButtonComponent } from '../../../../shared/ui/button/button';

/** État interne d'un menu ou sous-menu sélectionné */
interface MenuEntry {
  permissions: Set<PermissionLevel>;
}

const ALL_PERMISSIONS: PermissionLevel[] = ['READ', 'WRITE', 'DELETE'];

@Component({
  selector: 'app-profil-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent
  ],
  styles: [`
    .perm-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      cursor: pointer;
      border: 1.5px solid transparent;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      user-select: none;
    }
    .perm-pill.inactive {
      background: #f1f5f9;
      color: #94a3b8;
      border-color: #e2e8f0;
    }
    .perm-pill.active-read  { background: #eff6ff; color: #2563eb; border-color: #93c5fd; }
    .perm-pill.active-write { background: #f0fdf4; color: #16a34a; border-color: #86efac; }
    .perm-pill.active-delete{ background: #fff1f2; color: #dc2626; border-color: #fca5a5; }
    .perm-pill:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }
  `],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="modalTitle()"
      [subtitle]="modalSubtitle()"
      size="lg"
      (close)="onCancel()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5 pt-2">

        <!-- Informations de base -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-input
            formControlName="label"
            label="Libellé du Profil"
            placeholder="Ex: Administrateur Général, Gestionnaire..."
            [required]="true"
            [errorMessage]="form.get('label')?.touched && form.get('label')?.hasError('required') ? 'Le libellé est requis' : null"
          ></app-input>

          <app-input
            formControlName="profileCode"
            label="Code Profil"
            placeholder="Ex: ADMIN_GEN, MANAGER..."
            [required]="true"
            [errorMessage]="form.get('profileCode')?.touched && form.get('profileCode')?.hasError('required') ? 'Le code profil est requis' : null"
          ></app-input>
        </div>

        <div class="w-full sm:w-1/2">
          <app-select
            formControlName="status"
            label="Statut"
            [options]="statusOptions"
          ></app-select>
        </div>

        <!-- Habilitations / Menus -->
        <div class="space-y-3 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Habilitations &amp; Droits d'Accès
            </label>
            <!-- Légende des permissions -->
            <div class="flex items-center gap-2">
              <span class="perm-pill active-read">READ</span>
              <span class="perm-pill active-write">WRITE</span>
              <span class="perm-pill active-delete">DELETE</span>
            </div>
          </div>

          @if (menus().length === 0) {
            <p class="text-xs text-slate-400 italic text-center py-6 border border-dashed border-slate-200 rounded-xl">
              Aucun menu disponible dans le système.
            </p>
          } @else {
            <div class="rounded-xl border border-slate-200 bg-slate-50/50 max-h-[420px] overflow-y-auto divide-y divide-slate-100">
              @for (menu of menus(); track (menu.id || menu.reference || menu.code || $index); let i = $index) {
                <div class="bg-white hover:bg-slate-50/70 transition-colors">

                  <!-- Ligne Menu Principal -->
                  <div class="flex items-center gap-3 px-4 py-3">
                    <input
                      type="checkbox"
                      [id]="'menu-' + getMenuId(menu, i)"
                      [checked]="isMenuSelected(getMenuId(menu, i))"
                      (change)="toggleMenu(menu, i)"
                      class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                      [attr.aria-label]="'Sélectionner le menu ' + getMenuLabel(menu)"
                    />

                    <label
                      [for]="'menu-' + getMenuId(menu, i)"
                      class="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                    >
                      <i [class]="(menu.icon || 'ti ti-category') + ' text-indigo-500 text-base flex-shrink-0'"></i>
                      <span class="font-semibold text-sm text-slate-800 truncate">{{ getMenuLabel(menu) }}</span>
                      @if (menu.code) {
                        <span class="text-[10px] font-mono text-slate-400 flex-shrink-0">{{ menu.code }}</span>
                      }
                    </label>

                    <!-- Pills de permission pour le menu -->
                    @if (isMenuSelected(getMenuId(menu, i))) {
                      <div class="flex items-center gap-1.5 flex-shrink-0" role="group" [attr.aria-label]="'Permissions pour ' + getMenuLabel(menu)">
                        @for (perm of allPermissions; track perm) {
                          <button
                            type="button"
                            [class]="getPermPillClass(getMenuId(menu, i), null, perm)"
                            (click)="togglePermission(getMenuId(menu, i), null, perm)"
                            [attr.aria-pressed]="hasPermission(getMenuId(menu, i), null, perm)"
                            [attr.aria-label]="perm + ' sur ' + getMenuLabel(menu)"
                          >{{ perm }}</button>
                        }
                      </div>
                    }
                  </div>

                  <!-- Sous-menus -->
                  @if (getMenuSubMenus(menu).length > 0) {
                    <div class="bg-slate-50/80 border-t border-slate-100 divide-y divide-slate-100/70">
                      @for (sub of getMenuSubMenus(menu); track (sub.id || sub.reference || sub.code || $index); let j = $index) {
                        <div class="flex items-center gap-3 pl-10 pr-4 py-2.5">
                          <input
                            type="checkbox"
                            [id]="'sub-' + getMenuId(sub, j)"
                            [checked]="isSubMenuSelected(getMenuId(sub, j))"
                            (change)="toggleSubMenu(sub, j, getMenuId(menu, i))"
                            class="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                            [attr.aria-label]="'Sélectionner le sous-menu ' + getMenuLabel(sub)"
                          />

                          <label
                            [for]="'sub-' + getMenuId(sub, j)"
                            class="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                          >
                            <i class="ti ti-arrow-right text-slate-400 text-xs flex-shrink-0"></i>
                            <span class="text-xs text-slate-600 truncate">{{ getMenuLabel(sub) }}</span>
                            @if (sub.code) {
                              <span class="text-[10px] font-mono text-slate-400 flex-shrink-0">{{ sub.code }}</span>
                            }
                          </label>

                          <!-- Pills de permission pour le sous-menu -->
                          @if (isSubMenuSelected(getMenuId(sub, j))) {
                            <div class="flex items-center gap-1 flex-shrink-0" role="group" [attr.aria-label]="'Permissions pour ' + getMenuLabel(sub)">
                              @for (perm of allPermissions; track perm) {
                                <button
                                  type="button"
                                  [class]="getPermPillClass(getMenuId(menu, i), getMenuId(sub, j), perm)"
                                  (click)="togglePermission(getMenuId(menu, i), getMenuId(sub, j), perm)"
                                  [attr.aria-pressed]="hasPermission(getMenuId(menu, i), getMenuId(sub, j), perm)"
                                  [attr.aria-label]="perm + ' sur ' + getMenuLabel(sub)"
                                >{{ perm }}</button>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Résumé -->
            <p class="text-xs text-slate-500">
              <span class="font-semibold text-slate-700">{{ selectedMenuCount() }}</span> menu(s) sélectionné(s)
              @if (selectedSubMenuCount() > 0) {
                · <span class="font-semibold text-slate-700">{{ selectedSubMenuCount() }}</span> sous-menu(s)
              }
            </p>
          }
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <app-button
            type="button"
            variant="ghost"
            (btnClick)="onCancel()"
          >
            Annuler
          </app-button>

          <app-button
            type="submit"
            variant="primary"
            [loading]="loading()"
            iconLeft="ti ti-check"
          >
            {{ profil() ? 'Enregistrer les modifications' : 'Créer le profil' }}
          </app-button>
        </div>
      </form>
    </app-modal>
  `
})
export class ProfilFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly profil = input<ProfileCreateResponse | null>(null);
  readonly menus = input<MenuResponse[]>([]);
  readonly loading = input<boolean>(false);

  readonly save = output<ProfileCreateRequest>();
  readonly cancel = output<void>();

  readonly modalTitle = computed(() => this.profil() ? 'Modifier le profil' : 'Nouveau profil');
  readonly modalSubtitle = computed(() =>
    this.profil()
      ? 'Mettre à jour les informations et habilitations'
      : "Créez un profil d'habilitation et attribuez-lui des menus avec leurs droits d'accès"
  );

  /**
   * Clé = menuId → permissions accordées sur ce menu principal
   */
  readonly menuPermissions = signal<Map<string, Set<PermissionLevel>>>(new Map());

  /**
   * Clé = subMenuId → { parentMenuId, permissions }
   */
  readonly subMenuPermissions = signal<Map<string, { parentMenuId: string; permissions: Set<PermissionLevel> }>>(new Map());

  readonly allPermissions = ALL_PERMISSIONS;

  readonly statusOptions = [
    { label: 'Actif', value: 'ACTIVATED' },
    { label: 'Inactif', value: 'INACTIVATED' }
  ];

  readonly selectedMenuCount = computed(() => this.menuPermissions().size);
  readonly selectedSubMenuCount = computed(() => this.subMenuPermissions().size);

  form = this.fb.group({
    label: ['', [Validators.required]],
    profileCode: ['', [Validators.required]],
    status: ['ACTIVATED', [Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profil'] || changes['isOpen']) {
      const current = this.profil();
      if (current && this.isOpen()) {
        this.form.patchValue({
          label: current.label || '',
          profileCode: current.profileCode || current.code || '',
          status: current.status || 'ACTIVATED'
        });
        this._populateFromProfile(current);
      } else if (!current && this.isOpen()) {
        this.form.reset({ label: '', profileCode: '', status: 'ACTIVATED' });
        this.menuPermissions.set(new Map());
        this.subMenuPermissions.set(new Map());
      }
    }
  }

  // ─── Helpers de lecture ────────────────────────────────────────────────────

  getMenuId(menu: MenuResponse | { id?: string | null; reference?: string; code?: string }, index: number): string {
    return (menu.id ? String(menu.id) : null) || menu.reference || menu.code || `menu-${index}`;
  }

  getMenuLabel(menu: MenuResponse | { libelle?: string; label?: string }): string {
    return menu.libelle || menu.label || '';
  }

  getMenuSubMenus(menu: MenuResponse): any[] {
    return menu.sousMenus || menu.subMenus || [];
  }

  isMenuSelected(menuId: string): boolean {
    return this.menuPermissions().has(menuId);
  }

  isSubMenuSelected(subId: string): boolean {
    return this.subMenuPermissions().has(subId);
  }

  hasPermission(menuId: string, subId: string | null, perm: PermissionLevel): boolean {
    if (subId) {
      return this.subMenuPermissions().get(subId)?.permissions.has(perm) ?? false;
    }
    return this.menuPermissions().get(menuId)?.has(perm) ?? false;
  }

  getPermPillClass(menuId: string, subId: string | null, perm: PermissionLevel): string {
    const active = this.hasPermission(menuId, subId, perm);
    const base = 'perm-pill';
    if (!active) return `${base} inactive`;
    if (perm === 'READ') return `${base} active-read`;
    if (perm === 'WRITE') return `${base} active-write`;
    return `${base} active-delete`;
  }

  // ─── Actions utilisateur ───────────────────────────────────────────────────

  toggleMenu(menu: MenuResponse, index: number): void {
    const menuId = this.getMenuId(menu, index);
    const map = new Map(this.menuPermissions());
    const subMap = new Map(this.subMenuPermissions());

    if (map.has(menuId)) {
      // Décocher → retirer menu + tous ses sous-menus
      map.delete(menuId);
      const subList = this.getMenuSubMenus(menu);
      subList.forEach((s, j) => subMap.delete(this.getMenuId(s, j)));
    } else {
      // Cocher → ajouter avec READ par défaut
      map.set(menuId, new Set<PermissionLevel>(['READ']));
    }

    this.menuPermissions.set(map);
    this.subMenuPermissions.set(subMap);
  }

  toggleSubMenu(sub: any, subIndex: number, parentMenuId: string): void {
    const subId = this.getMenuId(sub, subIndex);
    const subMap = new Map(this.subMenuPermissions());
    const menuMap = new Map(this.menuPermissions());

    if (subMap.has(subId)) {
      subMap.delete(subId);
    } else {
      subMap.set(subId, { parentMenuId, permissions: new Set<PermissionLevel>(['READ']) });
      // Auto-cocher le menu parent
      if (!menuMap.has(parentMenuId)) {
        menuMap.set(parentMenuId, new Set<PermissionLevel>(['READ']));
        this.menuPermissions.set(menuMap);
      }
    }

    this.subMenuPermissions.set(subMap);
  }

  togglePermission(menuId: string, subId: string | null, perm: PermissionLevel): void {
    if (subId) {
      const subMap = new Map(this.subMenuPermissions());
      const entry = subMap.get(subId);
      if (!entry) return;
      const perms = new Set(entry.permissions);
      perms.has(perm) ? perms.delete(perm) : perms.add(perm);
      subMap.set(subId, { ...entry, permissions: perms });
      this.subMenuPermissions.set(subMap);
    } else {
      const menuMap = new Map(this.menuPermissions());
      const perms = menuMap.get(menuId);
      if (!perms) return;
      const newPerms = new Set(perms);
      newPerms.has(perm) ? newPerms.delete(perm) : newPerms.add(perm);
      menuMap.set(menuId, newPerms);
      this.menuPermissions.set(menuMap);
    }
  }

  // ─── Soumission ────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const profileMenus: ProfileMenuCreateRequest[] = [];

    // Une entrée par menu principal sélectionné
    this.menuPermissions().forEach((perms, menuId) => {
      profileMenus.push({
        menuId,
        permission: Array.from(perms).join(',') || 'READ'
      });
    });

    // Une entrée par sous-menu sélectionné
    this.subMenuPermissions().forEach((entry, subId) => {
      profileMenus.push({
        menuId: entry.parentMenuId,
        subMenuId: subId,
        permission: Array.from(entry.permissions).join(',') || 'READ'
      });
    });

    const payload: ProfileCreateRequest = {
      label: val.label!,
      profileCode: val.profileCode!,
      status: val.status || 'ACTIVATED',
      profileMenus
    };

    this.save.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // ─── Initialisation depuis un profil existant ──────────────────────────────

  private _populateFromProfile(profile: ProfileCreateResponse): void {
    const menuMap = new Map<string, Set<PermissionLevel>>();
    const subMap = new Map<string, { parentMenuId: string; permissions: Set<PermissionLevel> }>();

    if (profile.menus) {
      profile.menus.forEach(m => {
        const menuId = m.menuId || m.id;
        if (!menuId) return;

        const perms = this._parsePermissions(m.permission);
        menuMap.set(menuId, perms);

        if (m.subMenus) {
          m.subMenus.forEach(s => {
            if (!s.id) return;
            subMap.set(s.id, {
              parentMenuId: menuId,
              permissions: this._parsePermissions(s.permission)
            });
          });
        }
      });
    }

    this.menuPermissions.set(menuMap);
    this.subMenuPermissions.set(subMap);
  }

  private _parsePermissions(raw: string | undefined): Set<PermissionLevel> {
    const set = new Set<PermissionLevel>();
    if (!raw) {
      set.add('READ');
      return set;
    }
    raw.split(',').forEach(p => {
      const trimmed = p.trim().toUpperCase() as PermissionLevel;
      if (ALL_PERMISSIONS.includes(trimmed)) set.add(trimmed);
    });
    return set.size > 0 ? set : new Set<PermissionLevel>(['READ']);
  }
}
