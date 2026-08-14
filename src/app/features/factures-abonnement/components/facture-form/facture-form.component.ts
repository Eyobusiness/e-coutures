import { Component, ChangeDetectionStrategy, input, output, inject, effect, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FactureAbonnement, CreateFactureRequest } from '../../models/facture-abonnement.model';
import { Abonnement } from '../../../abonnements/models/abonnement.model';
import { Souscripteur } from '../../../souscripteurs/models/souscripteur.model';
import { Forfait } from '../../../forfaits/models/forfait.model';
import { InputComponent } from '../../../../shared/ui/input/input';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-facture-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facture-form.component.html',
  styleUrl: './facture-form.component.css',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent
  ]
})
export class FactureFormComponent {
  private fb = inject(FormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly facture = input<FactureAbonnement | null>(null);
  readonly abonnements = input<Abonnement[]>([]);
  readonly souscripteurs = input<Souscripteur[]>([]);
  readonly forfaits = input<Forfait[]>([]);
  readonly loading = input<boolean>(false);

  readonly save = output<CreateFactureRequest>();
  readonly cancel = output<void>();

  readonly selectedSouscripteurId = signal<string>('');

  readonly statutOptions = [
    { label: 'En attente', value: 'en_attente' },
    { label: 'Payée', value: 'payee' },
    { label: 'En retard', value: 'en_retard' },
    { label: 'Annulée', value: 'annulee' }
  ];

  readonly moyenPaiementOptions = [
    { label: 'Espèces', value: 'Espèces' },
    { label: 'Orange Money', value: 'Orange money' },
    { label: 'Moov Money', value: 'Moov money' },
    { label: 'MTN Money', value: 'MTN money' },
    { label: 'Wave', value: 'Wave' }
  ];

  readonly souscripteurOptions = computed(() => {
    return [
      { label: 'Tous les souscripteurs...', value: '' },
      ...this.souscripteurs().map((s) => ({
        label: `${s.nomComplet} (${s.email || s.telephone || s.matricule || 'N/A'})`,
        value: s.id
      }))
    ];
  });

  readonly abonnementOptions = computed(() => {
    const filterSouscId = this.selectedSouscripteurId();
    const souscMap = new Map(this.souscripteurs().map(s => [s.id, s.nomComplet]));
    const forfaitMap = new Map(this.forfaits().map(f => [f.id, f]));

    let list = this.abonnements();
    if (filterSouscId) {
      list = list.filter(a => a.souscripteurId === filterSouscId);
    }

    return list.map((a) => {
      const sName = souscMap.get(a.souscripteurId) || 'Souscripteur Inconnu';
      const forfait = forfaitMap.get(a.forfaitId);
      const fName = a.forfaitNom || (forfait ? forfait.nom : 'Forfait');
      const prix = a.montant || (forfait ? (a.periode === 'annuel' ? forfait.prixAnnuel : forfait.prixMensuel) : 0);
      const prixFormatted = new Intl.NumberFormat('fr-FR').format(prix);

      return {
        label: `${sName} - ${fName} (${a.periode || 'mensuel'}) - ${prixFormatted} FCFA`,
        value: a.id
      };
    });
  });

  todayStr = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    souscripteurId: [''],
    abonnementId: ['', [Validators.required]],
    montant: [0, [Validators.required, Validators.min(0)]],
    devise: ['XOF', [Validators.required]],
    statut: ['en_attente', [Validators.required]],
    dateEcheance: [this.todayStr, [Validators.required]],
    datePaiement: [''],
    moyenPaiement: [''],
    refTransaction: [''],
    pdfUrl: ['']
  });

  constructor() {
    effect(() => {
      const data = this.facture();
      if (data) {
        const matchingAbo = this.abonnements().find(a => a.id === data.abonnementId);
        const sId = matchingAbo ? matchingAbo.souscripteurId : '';
        this.selectedSouscripteurId.set(sId);

        this.form.patchValue({
          souscripteurId: sId,
          abonnementId: data.abonnementId,
          montant: data.montant || 0,
          devise: data.devise || 'XOF',
          statut: data.statut || 'en_attente',
          dateEcheance: data.dateEcheance ? data.dateEcheance.substring(0, 10) : this.todayStr,
          datePaiement: data.datePaiement ? data.datePaiement.substring(0, 16) : '',
          moyenPaiement: data.moyenPaiement || '',
          refTransaction: data.refTransaction || '',
          pdfUrl: data.pdfUrl || ''
        });
      } else {
        this.selectedSouscripteurId.set('');
        this.form.reset({
          souscripteurId: '',
          abonnementId: '',
          montant: 0,
          devise: 'XOF',
          statut: 'en_attente',
          dateEcheance: this.todayStr,
          datePaiement: '',
          moyenPaiement: '',
          refTransaction: '',
          pdfUrl: ''
        });
      }
    });

    // Filter abonnements when souscripteur changes
    this.form.get('souscripteurId')?.valueChanges.subscribe((sId) => {
      this.selectedSouscripteurId.set(sId || '');
      const currentAboId = this.form.get('abonnementId')?.value;
      if (currentAboId && sId) {
        const isValid = this.abonnements().some(a => a.id === currentAboId && a.souscripteurId === sId);
        if (!isValid) {
          this.form.get('abonnementId')?.setValue('');
          this.form.get('montant')?.setValue(0);
        }
      }
    });

    // Auto-populate montant & souscripteur when selecting abonnement
    this.form.get('abonnementId')?.valueChanges.subscribe((aboId) => {
      if (aboId) {
        const abo = this.abonnements().find(a => a.id === aboId);
        if (abo) {
          // Sync souscripteur
          if (!this.form.get('souscripteurId')?.value && abo.souscripteurId) {
            this.form.get('souscripteurId')?.setValue(abo.souscripteurId, { emitEvent: false });
            this.selectedSouscripteurId.set(abo.souscripteurId);
          }

          // Compute and auto-fill montant
          let calculatedAmount = abo.montant || 0;
          if (!calculatedAmount) {
            const forfait = this.forfaits().find(f => f.id === abo.forfaitId);
            if (forfait) {
              calculatedAmount = abo.periode === 'annuel' ? forfait.prixAnnuel : forfait.prixMensuel;
            }
          }

          if (calculatedAmount > 0) {
            this.form.get('montant')?.setValue(calculatedAmount);
          }
        }
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
      abonnementId: val.abonnementId!,
      montant: Number(val.montant),
      devise: val.devise!,
      statut: val.statut!,
      dateEcheance: val.dateEcheance!,
      datePaiement: val.datePaiement || undefined,
      moyenPaiement: val.moyenPaiement || undefined,
      refTransaction: val.refTransaction || undefined,
      pdfUrl: val.pdfUrl || undefined
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
