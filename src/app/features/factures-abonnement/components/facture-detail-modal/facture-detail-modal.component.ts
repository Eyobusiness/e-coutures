import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FactureAbonnement } from '../../models/facture-abonnement.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-facture-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facture-detail-modal.component.html',
  styleUrl: './facture-detail-modal.component.css',
  imports: [DatePipe, BadgeComponent, ButtonComponent]
})
export class FactureDetailModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly item = input<FactureAbonnement | null>(null);

  readonly close = output<void>();
  readonly printReceipt = output<FactureAbonnement>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
