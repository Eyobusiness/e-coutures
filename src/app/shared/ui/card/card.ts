import { Component, input } from '@angular/core';

export type CardVariant = 'default' | 'glass' | 'primary' | 'gradient';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.css',
  host: {
    'class': 'block'
  }
})
export class CardComponent {
  title = input<string | null>(null);
  subtitle = input<string | null>(null);
  icon = input<string | null>(null);
  hoverable = input<boolean>(false);
  bordered = input<boolean>(true);
  padded = input<boolean>(true);
  shadow = input<CardShadow>('sm');
  variant = input<CardVariant>('default');
}
