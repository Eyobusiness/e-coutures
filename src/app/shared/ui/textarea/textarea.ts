import { Component, input, output, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  host: {
    'class': 'block'
  }
})
export class TextareaComponent implements ControlValueAccessor {
  label = input<string | null>(null);
  placeholder = input<string>('');
  rows = input<number>(4);
  maxLength = input<number | null>(null);
  showCount = input<boolean>(false);
  hint = input<string | null>(null);
  errorMessage = input<string | null>(null);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  readonly = input<boolean>(false);
  id = input<string>(`textarea-${Math.random().toString(36).substr(2, 9)}`);

  valueChange = output<string>();

  value = signal<string>('');
  isDisabled = signal<boolean>(false);

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
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
