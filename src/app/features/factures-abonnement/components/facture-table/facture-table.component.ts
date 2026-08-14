import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FactureAbonnement } from '../../models/facture-abonnement.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-facture-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facture-table.component.html',
  styleUrl: './facture-table.component.css',
  imports: [DatePipe, BadgeComponent, ButtonComponent, EmptyStateComponent]
})
export class FactureTableComponent {
  readonly items = input<FactureAbonnement[]>([]);

  readonly view = output<FactureAbonnement>();
  readonly edit = output<FactureAbonnement>();
  readonly pay = output<FactureAbonnement>();
  readonly printReceipt = output<FactureAbonnement>();
  readonly delete = output<FactureAbonnement>();
}
