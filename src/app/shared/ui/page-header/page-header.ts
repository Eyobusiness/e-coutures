import { Component, input } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb';
import { BadgeComponent } from '../badge/badge';

@Component({
  selector: 'app-page-header',
  imports: [BreadcrumbComponent, BadgeComponent],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
  host: {
    'class': 'block mb-6'
  }
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string | null>(null);
  icon = input<string | null>(null);
  badgeText = input<string | null>(null);
  breadcrumbs = input<BreadcrumbItem[]>([]);
}
