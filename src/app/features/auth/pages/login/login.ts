import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  host: {
    'class': 'block min-h-screen bg-slate-950 font-sans'
  }
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    rememberMe: [true]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.warning('Veuillez remplir tous les champs obligatoires.', 'Formulaire invalide');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    this.authService.loginAdmin({
      username: username!,
      password: password!,
      pusher: 'WEB_BACKOFFICE'
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastService.success(`Bienvenue, ${res.firstName || 'Administrateur'} !`, 'Connexion réussie');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Identifiants incorrects. Veuillez vérifier vos accès.';
        this.errorMessage.set(msg);
      }
    });
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
