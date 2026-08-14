import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FactureAbonnement, PayFactureRequest } from '../../models/facture-abonnement.model';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-facture-pay-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facture-pay-modal.component.html',
  styleUrl: './facture-pay-modal.component.css',
  imports: [ReactiveFormsModule, SelectComponent, InputComponent, ButtonComponent]
})
export class FacturePayModalComponent {
  private fb = inject(FormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly facture = input<FactureAbonnement | null>(null);
  readonly loading = input<boolean>(false);

  readonly submitPayment = output<PayFactureRequest>();
  readonly cancel = output<void>();

  readonly moyenPaiementOptions = [
    { label: 'Espèces', value: 'Espèces' },
    { label: 'Orange Money', value: 'Orange money' },
    { label: 'Moov Money', value: 'Moov money' },
    { label: 'MTN Money', value: 'MTN money' },
    { label: 'Wave', value: 'Wave' }
  ];

  form = this.fb.group({
    moyenPaiement: ['Espèces', [Validators.required]],
    refTransaction: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    this.submitPayment.emit({
      moyenPaiement: val.moyenPaiement!,
      refTransaction: val.refTransaction!
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
