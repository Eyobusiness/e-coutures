import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';

function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (!password || !confirm) return null;
    return password.value !== confirm.value ? { passwordMismatch: true } : null;
  };
}

@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
  host: { 'class': 'block min-h-screen bg-slate-950' }
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly resetDone = signal<boolean>(false);

  form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator() }
  );

  ngOnInit(): void {
    // Pre-fill email and token from sessionStorage (set by forgot-password page)
    const storedEmail = sessionStorage.getItem('reset_email');
    const storedToken = sessionStorage.getItem('reset_token');
    if (storedEmail) {
      this.form.patchValue({ email: storedEmail });
    }
    // Store token to use on submit
    if (storedToken) {
      this._token = storedToken;
    }
  }

  private _token: string = '';

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, code } = this.form.value;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword({
      email: email!,
      password: password!,
      token: this._token,
      code: code!
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.resetDone.set(true);
        // Clean sessionStorage
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('reset_token');
        this.toastService.success('Votre mot de passe a été réinitialisé avec succès !', 'Succès');
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Code invalide ou expiré. Veuillez recommencer.';
        this.errorMessage.set(msg);
      }
    });
  }
}
