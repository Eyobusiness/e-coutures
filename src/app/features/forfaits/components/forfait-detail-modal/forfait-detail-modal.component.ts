import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Forfait } from '../../models/forfait.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-forfait-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forfait-detail-modal.component.html',
  styleUrl: './forfait-detail-modal.component.css',
  imports: [DatePipe, DecimalPipe, BadgeComponent, ButtonComponent]
})
export class ForfaitDetailModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly item = input<Forfait | null>(null);

  readonly close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
