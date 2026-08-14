import { Component, ChangeDetectionStrategy, input, output, inject, effect, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Abonnement, CreateAbonnementRequest } from '../../models/abonnement.model';
import { Souscripteur } from '../../../souscripteurs/models/souscripteur.model';
import { Forfait } from '../../../forfaits/models/forfait.model';
import { InputComponent } from '../../../../shared/ui/input/input';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-abonnement-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './abonnement-form.component.html',
  styleUrl: './abonnement-form.component.css',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent
  ]
})
export class AbonnementFormComponent {
  private fb = inject(FormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly abonnement = input<Abonnement | null>(null);
  readonly souscripteurs = input<Souscripteur[]>([]);
  readonly forfaits = input<Forfait[]>([]);
  readonly loading = input<boolean>(false);

  readonly save = output<CreateAbonnementRequest>();
  readonly cancel = output<void>();

  readonly selectedPeriode = signal<string>('mensuel');
  readonly selectedForfaitId = signal<string>('');

  readonly statutOptions = [
    { label: 'Essai', value: 'en_essai' },
    { label: 'Actif', value: 'actif' },
    { label: 'Inactif', value: 'inactif' },
    { label: 'Expiré', value: 'expire' },
    { label: 'Suspendu', value: 'suspendu' }
  ];

  readonly periodeOptions = [
    { label: 'Mensuel (Prix Min)', value: 'mensuel' },
    { label: 'Annuel (Prix Max)', value: 'annuel' }
  ];

  readonly renouvellementOptions = [
    { label: 'Automatique', value: 'true' },
    { label: 'Manuel', value: 'false' }
  ];

  readonly souscripteurOptions = computed(() => {
    return this.souscripteurs().map(s => ({
      label: `${s.nomComplet} (${s.email})`,
      value: s.id
    }));
  });

  readonly forfaitOptions = computed(() => {
    const isAnnuel = this.selectedPeriode() === 'annuel';
    return this.forfaits().map(f => {
      const price = isAnnuel ? (f.prixAnnuel || f.prixMensuel * 12 || 0) : (f.prixMensuel || 0);
      const unit = isAnnuel ? '/ an' : '/ mois';
      return {
        label: `${f.nom || f.id} — ${price} FCFA ${unit}`,
        value: f.id
      };
    });
  });

  readonly selectedForfaitDetail = computed(() => {
    const id = this.selectedForfaitId();
    if (!id) return null;
    return this.forfaits().find(f => f.id === id) || null;
  });

  todayStr = new Date().toISOString().split('T')[0];
  nextYearStr = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

  form = this.fb.group({
    souscripteurId: ['', [Validators.required]],
    periode: ['mensuel', [Validators.required]],
    forfaitId: ['', [Validators.required]],
    statut: ['en_essai', [Validators.required]],
    dateDebut: [this.todayStr, [Validators.required]],
    dateFin: [this.nextYearStr, [Validators.required]],
    renouvellementAuto: ['true', [Validators.required]]
  });

  constructor() {
    this.form.get('periode')?.valueChanges.subscribe(val => {
      if (val) {
        this.selectedPeriode.set(val);
      }
    });

    this.form.get('forfaitId')?.valueChanges.subscribe(val => {
      this.selectedForfaitId.set(val || '');
    });

    effect(() => {
      const data = this.abonnement();
      if (data) {
        const p = data.periode || 'mensuel';
        this.selectedPeriode.set(p);
        this.selectedForfaitId.set(data.forfaitId || '');

        this.form.patchValue({
          souscripteurId: data.souscripteurId || '',
          periode: p,
          forfaitId: data.forfaitId || '',
          statut: data.statut || 'en_essai',
          dateDebut: data.dateDebut || this.todayStr,
          dateFin: data.dateFin || this.nextYearStr,
          renouvellementAuto: data.renouvellementAuto !== undefined ? String(data.renouvellementAuto) : 'true'
        });
      } else {
        this.selectedPeriode.set('mensuel');
        this.selectedForfaitId.set('');

        this.form.reset({
          souscripteurId: '',
          periode: 'mensuel',
          forfaitId: '',
          statut: 'en_essai',
          dateDebut: this.todayStr,
          dateFin: this.nextYearStr,
          renouvellementAuto: 'true'
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
      souscripteurId: val.souscripteurId!,
      forfaitId: val.forfaitId!,
      statut: val.statut!,
      dateDebut: val.dateDebut!,
      dateFin: val.dateFin!,
      renouvellementAuto: String(val.renouvellementAuto) === 'true',
      periode: val.periode!
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
