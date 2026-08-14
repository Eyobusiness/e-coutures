import { Component, input, inject } from '@angular/core';
import { ToastService, ToastMessage } from './toast.service';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  host: {
    'class': 'block'
  }
})
export class ToastComponent {
  toastService = inject(ToastService);
  position = input<ToastPosition>('top-right');

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
