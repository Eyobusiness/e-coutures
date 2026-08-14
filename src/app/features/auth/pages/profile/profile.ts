import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { AvatarComponent } from '../../../../shared/ui/avatar/avatar';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminService } from '../../../../core/services/admin.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    CardComponent,
    InputComponent,
    ButtonComponent,
    BadgeComponent,
    AvatarComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  host: {
    'class': 'block p-6 max-w-6xl mx-auto space-y-6'
  }
})
export class ProfileComponent {
  protected authService = inject(AuthService);
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  isSavingProfile = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);

  user = this.authService.currentUser();

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  profileForm = this.fb.group({
    firstName: [this.user?.firstName || '', [Validators.required]],
    lastName: [this.user?.lastName || '', [Validators.required]],
    email: [this.user?.email || '', [Validators.required, Validators.email]],
    phone: [this.user?.phone || '', [Validators.required]],
    code: [{ value: this.user?.code || '', disabled: true }],
    role: [{ value: this.user?.profile?.label || 'Administrateur', disabled: true }]
  });

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.toastService.warning('Veuillez remplir correctement tous les champs de mot de passe.', 'Formulaire invalide');
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.toastService.error('Le nouveau mot de passe et sa confirmation ne sont pas identiques.', 'Erreur de saisie');
      return;
    }

    if (!this.user?.id) {
      this.toastService.error('Impossible de trouver l\'identifiant de l\'utilisateur.', 'Erreur');
      return;
    }

    this.isChangingPassword.set(true);

    this.adminService.updateAdmin(this.user.id, {
      password: newPassword!
    }).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.passwordForm.reset();
        this.toastService.success('Modification effectuée avec succès !', 'Mise à jour du mot de passe');
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        const msg = err?.error?.message || 'Erreur de mise à jour du mot de passe.';
        this.toastService.error(msg, 'Erreur de mise à jour');
      }
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid || !this.user?.id) {
      this.toastService.warning('Veuillez vérifier les informations du profil.', 'Formulaire invalide');
      return;
    }

    this.isSavingProfile.set(true);

    const { firstName, lastName, email, phone } = this.profileForm.value;

    this.adminService.updateAdmin(this.user.id, {
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      phone: phone!
    }).subscribe({
      next: () => {
        this.isSavingProfile.set(false);
        this.toastService.success('Modification effectuée avec succès !', 'Mise à jour du profil');
      },
      error: (err) => {
        this.isSavingProfile.set(false);
        const msg = err?.error?.message || 'Erreur de mise à jour du profil.';
        this.toastService.error(msg, 'Erreur de mise à jour');
      }
    });
  }
}
