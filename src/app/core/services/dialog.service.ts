import { Injectable, signal } from '@angular/core';
import { DialogConfig, InternalDialogState } from '../models/dialog-config.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  activeDialog = signal<InternalDialogState | null>(null);

  confirm(config: DialogConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.activeDialog.set({
        ...config,
        confirmText: config.confirmText || 'Confirmer',
        cancelText: config.cancelText || 'Annuler',
        type: config.type || 'primary',
        resolve
      });
    });
  }

  confirmDelete(title: string = 'Confirmation de suppression', message: string = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'): Promise<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      icon: 'ti ti-trash'
    });
  }

  onConfirm(): void {
    const dialog = this.activeDialog();
    if (dialog) {
      dialog.resolve(true);
      this.activeDialog.set(null);
    }
  }

  onCancel(): void {
    const dialog = this.activeDialog();
    if (dialog) {
      dialog.resolve(false);
      this.activeDialog.set(null);
    }
  }
}
