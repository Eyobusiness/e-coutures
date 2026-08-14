import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Forfait } from '../../models/forfait.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-forfait-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forfait-table.component.html',
  styleUrl: './forfait-table.component.css',
  imports: [DecimalPipe, BadgeComponent, ButtonComponent, EmptyStateComponent]
})
export class ForfaitTableComponent {
  readonly items = input<Forfait[]>([]);

  readonly view = output<Forfait>();
  readonly edit = output<Forfait>();
  readonly delete = output<Forfait>();
}
