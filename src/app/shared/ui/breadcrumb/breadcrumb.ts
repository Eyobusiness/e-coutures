import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
  host: {
    'aria-label': 'Fil d\'Ariane'
  }
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
  separatorIcon = input<string>('ti ti-chevron-right');
}
