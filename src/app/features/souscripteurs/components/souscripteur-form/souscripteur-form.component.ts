import { Component, ChangeDetectionStrategy, input, output, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Souscripteur, CreateSouscripteurRequest } from '../../models/souscripteur.model';
import { InputComponent } from '../../../../shared/ui/input/input';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-souscripteur-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent
  ],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        role="dialog"
        aria-modal="true"
        (click)="onBackdropClick($event)"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 animate-scale-up space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 class="text-xl font-bold text-slate-900">
                {{ souscripteur() ? 'Modifier le Souscripteur' : 'Nouveau Souscripteur' }}
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ souscripteur() ? 'Mettez à jour les informations du souscripteur.' : 'Remplissez le formulaire pour ajouter un souscripteur.' }}
              </p>
            </div>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              (click)="cancel.emit()"
            >
              <i class="ti ti-x text-lg"></i>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <app-input
              formControlName="nomComplet"
              label="Nom Complet"
              placeholder="Ex: Jean Dupont"
              iconLeft="ti ti-user"
              [required]="true"
            ></app-input>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input
                formControlName="email"
                type="email"
                label="Adresse Email"
                placeholder="jean.dupont@email.com"
                iconLeft="ti ti-mail"
                [required]="true"
              ></app-input>

              <app-input
                formControlName="telephone"
                type="tel"
                label="Téléphone"
                placeholder="+225 0700000000"
                iconLeft="ti ti-phone"
                [required]="true"
              ></app-input>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-input
                formControlName="pays"
                label="Pays"
                placeholder="Ex: Côte d'Ivoire"
                iconLeft="ti ti-world"
                [required]="true"
              ></app-input>

              <app-input
                formControlName="devise"
                label="Devise"
                placeholder="Ex: XOF"
                iconLeft="ti ti-currency-dollar"
                [required]="true"
              ></app-input>
            </div>

            <app-select
              formControlName="statut"
              label="Statut du Compte"
              [options]="statutOptions"
              [required]="true"
            ></app-select>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <app-button
                type="button"
                variant="ghost"
                (btnClick)="cancel.emit()"
              >
                Annuler
              </app-button>

              <app-button
                type="submit"
                variant="primary"
                iconLeft="ti ti-check"
                [loading]="loading()"
              >
                {{ souscripteur() ? 'Mettre à jour' : 'Enregistrer' }}
              </app-button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class SouscripteurFormComponent {
  private fb = inject(FormBuilder);

  isOpen = input<boolean>(false);
  souscripteur = input<Souscripteur | null>(null);
  loading = input<boolean>(false);

  save = output<CreateSouscripteurRequest>();
  cancel = output<void>();

  statutOptions = [
    { label: 'Actif', value: 'actif' },
    { label: 'Inactif', value: 'inactif' },
    { label: 'Suspendu', value: 'suspendu' }
  ];

  form = this.fb.group({
    nomComplet: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required]],
    pays: ['Côte d\'Ivoire', [Validators.required]],
    devise: ['XOF', [Validators.required]],
    statut: ['actif', [Validators.required]]
  });

  constructor() {
    effect(() => {
      const data = this.souscripteur();
      if (data) {
        this.form.patchValue({
          nomComplet: data.nomComplet,
          email: data.email,
          telephone: data.telephone,
          pays: data.pays,
          devise: data.devise,
          statut: data.statut || 'actif'
        });
      } else {
        this.form.reset({
          nomComplet: '',
          email: '',
          telephone: '',
          pays: 'Côte d\'Ivoire',
          devise: 'XOF',
          statut: 'actif'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    this.save.emit({
      nomComplet: val.nomComplet!,
      email: val.email!,
      telephone: val.telephone!,
      pays: val.pays!,
      devise: val.devise!,
      statut: val.statut!
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
