import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-4 right-4 z-[10000] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-slide-in-right bg-white/95"
          [class.border-emerald-500]="toast.type === 'success'"
          [class.border-red-500]="toast.type === 'error'"
          [class.border-amber-500]="toast.type === 'warning'"
          [class.border-sky-400]="toast.type === 'info'"
          role="alert"
        >
          <div class="flex-shrink-0 mt-0.5">
            @switch (toast.type) {
              @case ('success') {
                <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <i class="ti ti-check text-lg"></i>
                </div>
              }
              @case ('error') {
                <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <i class="ti ti-alert-triangle text-lg"></i>
                </div>
              }
              @case ('warning') {
                <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i class="ti ti-alert-circle text-lg"></i>
                </div>
              }
              @default {
                <div class="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                  <i class="ti ti-info-circle text-lg"></i>
                </div>
              }
            }
          </div>

          <div class="flex-1 min-w-0">
            @if (toast.title) {
              <h4 class="text-sm font-semibold text-slate-900 leading-tight mb-0.5">
                {{ toast.title }}
              </h4>
            }
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ toast.message }}
            </p>
          </div>

          <button
            type="button"
            class="flex-shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            (click)="toastService.remove(toast.id)"
            aria-label="Fermer"
          >
            <i class="ti ti-x text-base"></i>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
