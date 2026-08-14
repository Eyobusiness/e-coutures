import { Component, ChangeDetectionStrategy, input, output, inject, OnChanges, SimpleChanges, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Utilisateur, CreateUtilisateurRequest } from '../../models/utilisateur.model';
import { ProfileCreateResponse } from '../../../../core/models/profile.model';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { InputComponent } from '../../../../shared/ui/input/input';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-utilisateur-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent
  ],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="modalTitle()"
      [subtitle]="modalSubtitle()"
      size="lg"
      (close)="onCancel()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 pt-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-input
            formControlName="firstName"
            label="Prénom"
            placeholder="Ex: Jean"
            [required]="true"
            [errorMessage]="form.get('firstName')?.touched && form.get('firstName')?.hasError('required') ? 'Le prénom est requis' : null"
          ></app-input>

          <app-input
            formControlName="lastName"
            label="Nom"
            placeholder="Ex: Dupont"
            [required]="true"
            [errorMessage]="form.get('lastName')?.touched && form.get('lastName')?.hasError('required') ? 'Le nom est requis' : null"
          ></app-input>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-input
            formControlName="email"
            type="email"
            label="Adresse Email"
            placeholder="Ex: jean.dupont@example.com"
            [required]="true"
            [errorMessage]="getFieldError('email')"
          ></app-input>

          <app-input
            formControlName="phone"
            type="tel"
            label="Téléphone"
            placeholder="Ex: +225 0700000000"
            [required]="true"
            [errorMessage]="form.get('phone')?.touched && form.get('phone')?.hasError('required') ? 'Le téléphone est requis' : null"
          ></app-input>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-input
            formControlName="code"
            label="Code Utilisateur"
            placeholder="Ex: ADM-001"
          ></app-input>

          <app-select
            formControlName="profileId"
            label="Profil / Rôle"
            [options]="profileOptions"
            placeholder="Sélectionner un profil"
          ></app-select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-select
            formControlName="status"
            label="Statut"
            [options]="statusOptions"
          ></app-select>

          <app-input
            formControlName="password"
            type="password"
            [label]="admin() ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'"
            placeholder="••••••••"
            [required]="!admin()"
            [errorMessage]="getFieldError('password')"
          ></app-input>
        </div>

        <!-- Form Actions -->
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
            {{ admin() ? 'Enregistrer les modifications' : "Créer l'utilisateur" }}
          </app-button>
        </div>
      </form>
    </app-modal>
  `
})
export class UtilisateurFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly admin = input<Utilisateur | null>(null);
  readonly profiles = input<ProfileCreateResponse[]>([]);
  readonly loading = input<boolean>(false);

  readonly save = output<CreateUtilisateurRequest>();
  readonly cancel = output<void>();

  readonly modalTitle = computed(() => this.admin() ? "Modifier l'administrateur" : "Nouvel administrateur");
  readonly modalSubtitle = computed(() => this.admin() ? "Mettre à jour les informations de l'utilisateur" : "Remplissez le formulaire pour créer un utilisateur administrateur");

  readonly statusOptions = [
    { label: 'Actif', value: 'ACTIVATED' },
    { label: 'Inactif', value: 'INACTIVATED' }
  ];

  get profileOptions() {
    return this.profiles().map(p => ({
      label: p.label || p.code || 'Profil ' + p.id,
      value: p.id
    }));
  }

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    code: [''],
    status: ['ACTIVATED', [Validators.required]],
    profileId: [''],
    password: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['admin'] || changes['isOpen']) {
      const currentAdmin = this.admin();
      if (currentAdmin && this.isOpen()) {
        this.form.patchValue({
          firstName: currentAdmin.firstName || '',
          lastName: currentAdmin.lastName || '',
          email: currentAdmin.email || '',
          phone: currentAdmin.phone || '',
          code: currentAdmin.code || '',
          status: currentAdmin.status || 'ACTIVATED',
          profileId: currentAdmin.profileId || '',
          password: ''
        });
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      } else if (!currentAdmin && this.isOpen()) {
        this.form.reset({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          code: '',
          status: 'ACTIVATED',
          profileId: '',
          password: ''
        });
        this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.form.get('password')?.updateValueAndValidity();
      }
    }
  }

  getFieldError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.touched) return null;

    if (control.hasError('required')) return 'Ce champ est requis';
    if (control.hasError('email')) return 'Adresse email invalide';
    if (control.hasError('minlength')) return 'Le mot de passe doit faire au moins 6 caractères';

    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const payload: CreateUtilisateurRequest = {
      firstName: val.firstName!,
      lastName: val.lastName!,
      email: val.email!,
      phone: val.phone!,
      code: val.code || undefined,
      status: val.status || 'ACTIVATED',
      profileId: val.profileId || undefined,
      ...(val.password ? { password: val.password } : {})
    };

    this.save.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
