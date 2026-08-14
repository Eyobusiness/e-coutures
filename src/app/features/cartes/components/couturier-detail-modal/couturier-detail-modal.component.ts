import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CouturierCarteDetail } from '../../models/carte.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

@Component({
  selector: 'app-couturier-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './couturier-detail-modal.component.html',
  styleUrl: './couturier-detail-modal.component.css',
  imports: [BadgeComponent, ButtonComponent, LoaderComponent]
})
export class CouturierDetailModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly detail = input<CouturierCarteDetail | null>(null);
  readonly loading = input<boolean>(false);

  readonly close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
