import { Component, input, output } from '@angular/core';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'dark';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  host: {
    'class': 'inline-flex items-center'
  }
})
export class BadgeComponent {
  variant = input<BadgeVariant>('primary');
  size = input<BadgeSize>('md');
  dot = input<boolean>(false);
  icon = input<string | null>(null);
  rounded = input<boolean>(false);
  removable = input<boolean>(false);

  remove = output<void>();

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
