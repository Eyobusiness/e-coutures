import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FactureAbonnement } from '../../models/facture-abonnement.model';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-facture-recu-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facture-recu-modal.component.html',
  styleUrl: './facture-recu-modal.component.css',
  imports: [DatePipe, ButtonComponent]
})
export class FactureRecuModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly item = input<FactureAbonnement | null>(null);

  readonly close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('recu-backdrop')) {
      this.close.emit();
    }
  }

  printReceipt(): void {
    window.print();
  }

  getReceiptNumber(factureId?: string): string {
    if (!factureId) return 'REC-000000';
    return `REC-${factureId.substring(0, 8).toUpperCase()}`;
  }
}
