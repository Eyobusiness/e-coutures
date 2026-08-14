import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  host: {
    'class': 'block'
  }
})
export class EmptyStateComponent {
  icon = input<string>('ti ti-folder-off');
  title = input<string>('Aucune donnée disponible');
  description = input<string | null>('Il n\'y a actuellement aucun élément à afficher ici.');
  actionLabel = input<string | null>(null);
  actionIcon = input<string | null>('ti ti-plus');

  action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
