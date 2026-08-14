import { Component, input, output, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local' | 'time';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  host: {
    'class': 'block'
  }
})
export class InputComponent implements ControlValueAccessor {
  label = input<string | null>(null);
  placeholder = input<string>('');
  type = input<InputType>('text');
  hint = input<string | null>(null);
  errorMessage = input<string | null>(null);
  iconLeft = input<string | null>(null);
  iconRight = input<string | null>(null);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  readonly = input<boolean>(false);
  id = input<string>(`input-${Math.random().toString(36).substr(2, 9)}`);

  valueChange = output<string>();

  value = signal<string>('');
  isDisabled = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value.set(val || '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }
}
