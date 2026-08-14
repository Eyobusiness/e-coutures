import { Component, ChangeDetectionStrategy, input, output, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Forfait, CreateForfaitRequest } from '../../models/forfait.model';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ButtonComponent } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-forfait-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forfait-form.component.html',
  styleUrl: './forfait-form.component.css',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent]
})
export class ForfaitFormComponent {
  private fb = inject(FormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly forfait = input<Forfait | null>(null);
  readonly loading = input<boolean>(false);

  readonly save = output<CreateForfaitRequest>();
  readonly cancel = output<void>();

  form = this.fb.group({
    nom: ['', [Validators.required]],
    prixMensuel: [0, [Validators.required, Validators.min(0)]],
    prixAnnuel: [0, [Validators.required, Validators.min(0)]],
    nbAteliersMax: [1, [Validators.required, Validators.min(1)]],
    nbUtilisateursMax: [1, [Validators.required, Validators.min(1)]],
    estActif: [true]
  });

  constructor() {
    effect(() => {
      const data = this.forfait();
      if (data) {
        this.form.patchValue({
          nom: data.nom,
          prixMensuel: data.prixMensuel || 0,
          prixAnnuel: data.prixAnnuel || 0,
          nbAteliersMax: data.nbAteliersMax || 1,
          nbUtilisateursMax: data.nbUtilisateursMax || 1,
          estActif: data.estActif ?? true
        });
      } else {
        this.form.reset({
          nom: '',
          prixMensuel: 0,
          prixAnnuel: 0,
          nbAteliersMax: 1,
          nbUtilisateursMax: 1,
          estActif: true
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    this.save.emit({
      nom: val.nom!,
      prixMensuel: Number(val.prixMensuel || 0),
      prixAnnuel: Number(val.prixAnnuel || 0),
      nbAteliersMax: Number(val.nbAteliersMax || 1),
      nbUtilisateursMax: Number(val.nbUtilisateursMax || 1),
      estActif: !!val.estActif
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }
}
