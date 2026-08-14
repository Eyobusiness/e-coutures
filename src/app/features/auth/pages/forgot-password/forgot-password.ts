import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  host: { 'class': 'block min-h-screen bg-slate-950' }
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly emailSent = signal<boolean>(false);
  readonly sentEmail = signal<string>('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email!;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.emailSent.set(true);
        this.sentEmail.set(res.email || email);
        this.toastService.success('Code de vérification envoyé !', 'Email envoyé');
        // Store email & token in sessionStorage for reset page
        sessionStorage.setItem('reset_email', res.email || email);
        sessionStorage.setItem('reset_token', res.token || '');
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Adresse email introuvable ou erreur serveur.';
        this.errorMessage.set(msg);
      }
    });
  }

  goToReset(): void {
    this.router.navigate(['/auth/reset-password']);
  }
}
