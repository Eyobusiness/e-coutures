import { Component, input, output, inject, computed } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info' | 'success' | 'primary';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  host: {
    '(document:keydown.escape)': 'onKeydownEscape($event)'
  }
})
export class ConfirmDialogComponent {
  protected dialogService = inject(DialogService);

  isOpen = input<boolean>(false);
  title = input<string>('Confirmation');
  message = input<string>('Êtes-vous sûr de vouloir effectuer cette action ?');
  confirmText = input<string>('Confirmer');
  cancelText = input<string>('Annuler');
  variant = input<ConfirmDialogVariant>('danger');
  icon = input<string | null>(null);
  loading = input<boolean>(false);

  confirm = output<void>();
  cancel = output<void>();
  close = output<void>();

  activeState = computed(() => {
    const dialog = this.dialogService.activeDialog();
    if (dialog) {
      return {
        open: true,
        title: dialog.title,
        message: dialog.message,
        confirmText: dialog.confirmText || 'Confirmer',
        cancelText: dialog.cancelText || 'Annuler',
        variant: (dialog.type as ConfirmDialogVariant) || 'danger',
        icon: dialog.icon || null
      };
    }
    return {
      open: this.isOpen(),
      title: this.title(),
      message: this.message(),
      confirmText: this.confirmText(),
      cancelText: this.cancelText(),
      variant: this.variant(),
      icon: this.icon()
    };
  });

  onConfirm(): void {
    if (!this.loading()) {
      if (this.dialogService.activeDialog()) {
        this.dialogService.onConfirm();
      }
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.loading()) {
      if (this.dialogService.activeDialog()) {
        this.dialogService.onCancel();
      }
      this.cancel.emit();
      this.close.emit();
    }
  }

  onKeydownEscape(event: Event): void {
    if (this.activeState().open && !this.loading()) {
      this.onCancel();
    }
  }
}
