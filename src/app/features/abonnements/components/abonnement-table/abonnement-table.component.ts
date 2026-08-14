import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Abonnement } from '../../models/abonnement.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-abonnement-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './abonnement-table.component.html',
  styleUrl: './abonnement-table.component.css',
  imports: [BadgeComponent, ButtonComponent, EmptyStateComponent]
})
export class AbonnementTableComponent {
  readonly items = input<Abonnement[]>([]);

  readonly view = output<Abonnement>();
  readonly edit = output<Abonnement>();
  readonly link = output<Abonnement>();
  readonly delete = output<Abonnement>();
}
