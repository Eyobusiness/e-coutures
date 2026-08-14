import { Component, input } from '@angular/core';

export type StatCardColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  host: {
    'class': 'block'
  }
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  subtitle = input<string | null>(null);
  icon = input<string>('ti ti-chart-bar');
  trend = input<number | null>(null);
  trendLabel = input<string | null>('vs mois dernier');
  color = input<StatCardColor>('primary');
}
