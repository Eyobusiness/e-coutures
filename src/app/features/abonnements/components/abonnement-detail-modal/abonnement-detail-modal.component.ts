import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Abonnement } from '../../models/abonnement.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-abonnement-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './abonnement-detail-modal.component.html',
  styleUrl: './abonnement-detail-modal.component.css',
  imports: [DatePipe, DecimalPipe, BadgeComponent, ButtonComponent]
})
export class AbonnementDetailModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly item = input<Abonnement | null>(null);

  readonly close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
