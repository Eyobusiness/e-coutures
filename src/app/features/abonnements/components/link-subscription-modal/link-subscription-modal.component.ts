import { Component, ChangeDetectionStrategy, input, output, inject, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Abonnement } from '../../models/abonnement.model';
import { Souscripteur } from '../../../souscripteurs/models/souscripteur.model';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { ButtonComponent } from '../../../../shared/ui/button/button';

export type LinkModalMode = 'link-abonnement' | 'link-souscripteur';

@Component({
  selector: 'app-link-subscription-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './link-subscription-modal.component.html',
  styleUrl: './link-subscription-modal.component.css',
  imports: [ReactiveFormsModule, SelectComponent, ButtonComponent]
})
export class LinkSubscriptionModalComponent {
  private fb = inject(FormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly mode = input<LinkModalMode>('link-abonnement');
  readonly souscripteur = input<Souscripteur | null>(null);
  readonly abonnement = input<Abonnement | null>(null);
  readonly abonnements = input<Abonnement[]>([]);
  readonly souscripteurs = input<Souscripteur[]>([]);
  readonly loading = input<boolean>(false);

  readonly submitLink = output<{ selectedId: string }>();
  readonly cancel = output<void>();

  form = this.fb.group({
    selectedId: ['', [Validators.required]]
  });

  readonly abonnementOptions = computed(() => {
    return this.abonnements().map((a) => ({
      label: `Abonnement ${a.periode || 'mensuel'} (${a.statut || 'en_essai'})`,
      value: a.id
    }));
  });

  readonly souscripteurOptions = computed(() => {
    return this.souscripteurs().map((s) => ({
      label: `${s.nomComplet} (${s.email})`,
      value: s.id
    }));
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitLink.emit({
      selectedId: this.form.value.selectedId!
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
