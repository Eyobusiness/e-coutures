import { Component, input, output } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  host: {
    '(document:keydown.escape)': 'onKeydownEscape($event)'
  }
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string | null>(null);
  subtitle = input<string | null>(null);
  size = input<ModalSize>('md');
  closeOnBackdrop = input<boolean>(true);
  showCloseButton = input<boolean>(true);

  close = output<void>();

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close.emit();
    }
  }

  onCloseClick(): void {
    this.close.emit();
  }

  onKeydownEscape(event: Event): void {
    if (this.isOpen()) {
      this.close.emit();
    }
  }
}
