import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(message: string, type: ToastType = 'info', title?: string, duration: number = 4000): string {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type, title, duration };
    this.toasts.update(list => [...list, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    return id;
  }

  success(message: string, title: string = 'Succès', duration: number = 4000): string {
    return this.show(message, 'success', title, duration);
  }

  error(message: string, title: string = 'Erreur', duration: number = 5000): string {
    return this.show(message, 'error', title, duration);
  }

  warning(message: string, title: string = 'Attention', duration: number = 4000): string {
    return this.show(message, 'warning', title, duration);
  }

  info(message: string, title: string = 'Information', duration: number = 4000): string {
    return this.show(message, 'info', title, duration);
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  remove(id: string): void {
    this.dismiss(id);
  }

  clear(): void {
    this.toasts.set([]);
  }
}
