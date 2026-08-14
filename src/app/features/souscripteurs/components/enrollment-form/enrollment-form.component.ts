import { Component, ChangeDetectionStrategy, input, output, inject, signal, computed, effect, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SouscripteurService } from '../../services/souscripteur.service';
import { ForfaitService } from '../../../forfaits/services/forfait.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { EnrollmentRequest } from '../../models/enrollment.model';
import { Forfait } from '../../../forfaits/models/forfait.model';

import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { InputComponent } from '../../../../shared/ui/input/input';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';

@Component({
  selector: 'app-enrollment-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.css',
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent
  ]
})
export class EnrollmentFormComponent implements OnInit {
  isOpen = input<boolean>(false);
  close = output<void>();
  enrolled = output<void>();

  private fb = inject(FormBuilder);
  private souscripteurService = inject(SouscripteurService);
  private forfaitService = inject(ForfaitService);
  private toastService = inject(ToastService);

  readonly isSubmitting = signal<boolean>(false);
  readonly forfaits = signal<Forfait[]>([]);
  readonly activeStep = signal<1 | 2 | 3>(1);

  form = this.fb.group({
    // Step 1: Subscriber & User Details
    nomComplet: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    telephone: ['', Validators.required],
    pays: ['Côte d\'Ivoire', Validators.required],
    devise: ['XOF', Validators.required],

    // Step 2: Subscription & Forfait
    forfaitId: ['', Validators.required],
    periode: ['mensuel' as 'mensuel' | 'annuel', Validators.required],
    renouvellementAuto: [true],
    facturePayee: [true],

    // Step 3: Workshop Details & Coordinates
    atelierNom: ['', Validators.required],
    atelierVille: ['Abidjan'],
    atelierAdresse: [''],
    atelierTelephone: [''],
    atelierEmail: [''],
    latitude: [5.3599517],
    longitude: [-4.0082563]
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.loadForfaits();
      }
    });
  }

  readonly forfaitOptions = computed(() => {
    return this.forfaits().map((f: any) => ({
      label: `${f.nom || f.name || f.code || 'Forfait'} (${(f.prixMensuel || f.price || 0).toLocaleString()} FCFA/mois)`,
      value: f.id || f._id || f.code
    }));
  });

  readonly periodOptions = [
    { label: 'Mensuel', value: 'mensuel' },
    { label: 'Annuel', value: 'annuel' }
  ];

  readonly paysOptions = [
    { label: 'Côte d\'Ivoire', value: 'Côte d\'Ivoire' },
    { label: 'Sénégal', value: 'Sénégal' },
    { label: 'Cameroun', value: 'Cameroun' },
    { label: 'Mali', value: 'Mali' },
    { label: 'Burkina Faso', value: 'Burkina Faso' },
    { label: 'Togo', value: 'Togo' },
    { label: 'Bénin', value: 'Bénin' }
  ];

  readonly deviseOptions = [
    { label: 'XOF (FCFA)', value: 'XOF' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'USD ($)', value: 'USD' }
  ];

  ngOnInit(): void {
    this.loadForfaits();
  }

  loadForfaits(): void {
    this.forfaitService.getAll(1, 100).subscribe({
      next: (res: any) => {
        let list: Forfait[] = [];
        if (res && Array.isArray(res.data)) {
          list = res.data;
        } else if (Array.isArray(res)) {
          list = res;
        } else if (res && Array.isArray(res.content)) {
          list = res.content;
        } else if (res && Array.isArray(res.items)) {
          list = res.items;
        }

        const activeList = list.filter((f: any) => f.estActif !== false && f.isActive !== false);
        const finalForfaits = activeList.length > 0 ? activeList : list;
        this.forfaits.set(finalForfaits);

        if (finalForfaits.length && !this.form.value.forfaitId) {
          const defaultId = finalForfaits[0].id || (finalForfaits[0] as any)._id || (finalForfaits[0] as any).code;
          this.form.patchValue({ forfaitId: defaultId });
        }
      },
      error: () => {
        this.forfaits.set([]);
      }
    });
  }

  setStep(step: 1 | 2 | 3): void {
    this.activeStep.set(step);
  }

  onCancel(): void {
    this.form.reset({
      pays: 'Côte d\'Ivoire',
      devise: 'XOF',
      periode: 'mensuel',
      renouvellementAuto: true,
      facturePayee: true,
      atelierVille: 'Abidjan',
      latitude: 5.3599517,
      longitude: -4.0082563
    });
    this.activeStep.set(1);
    this.close.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Veuillez remplir tous les champs obligatoires.', 'Formulaire invalide');
      return;
    }

    const val = this.form.value;
    const payload: EnrollmentRequest = {
      nomComplet: val.nomComplet || '',
      email: val.email || '',
      password: val.password || '',
      telephone: val.telephone || '',
      pays: val.pays || 'Côte d\'Ivoire',
      devise: val.devise || 'XOF',
      forfaitId: val.forfaitId || '',
      periode: (val.periode as 'mensuel' | 'annuel') || 'mensuel',
      renouvellementAuto: !!val.renouvellementAuto,
      facturePayee: !!val.facturePayee,
      atelierNom: val.atelierNom || '',
      atelierVille: val.atelierVille || undefined,
      atelierAdresse: val.atelierAdresse || undefined,
      atelierTelephone: val.atelierTelephone || val.telephone || undefined,
      atelierEmail: val.atelierEmail || val.email || undefined,
      latitude: Number(val.latitude) || 5.3599517,
      longitude: Number(val.longitude) || -4.0082563
    };

    this.isSubmitting.set(true);
    this.souscripteurService.enroll(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        const msg = res?.message || `Enrôlement réussi ! Matricule : ${res?.matricule || 'N/A'}`;
        this.toastService.success(msg, 'Succès Enrôlement');
        this.enrolled.emit();
        this.onCancel();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err?.error?.message || 'Erreur lors de l\'enrôlement de l\'abonné.';
        this.toastService.error(msg, 'Erreur d\'enrôlement');
      }
    });
  }
}
