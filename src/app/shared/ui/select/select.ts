import { Component, input, output, signal, computed, forwardRef, ElementRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  icon?: string;
  disabled?: boolean;
  description?: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  styleUrl: './select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  host: {
    'class': 'block relative',
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class SelectComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  label = input<string | null>(null);
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Sélectionner une option');
  hint = input<string | null>(null);
  errorMessage = input<string | null>(null);
  searchable = input<boolean>(false);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  multiple = input<boolean>(false);

  selectionChange = output<any>();

  isOpen = signal<boolean>(false);
  openUpward = signal<boolean>(false);
  filterQuery = signal<string>('');
  selectedValue = signal<any>(null);
  isDisabled = signal<boolean>(false);

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  filteredOptions = computed(() => {
    const query = this.filterQuery().toLowerCase().trim();
    if (!query) return this.options();
    return this.options().filter(o => o.label.toLowerCase().includes(query) || (o.description && o.description.toLowerCase().includes(query)));
  });

  selectedOptionLabel = computed(() => {
    const val = this.selectedValue();
    if (this.multiple() && Array.isArray(val)) {
      if (!val.length) return this.placeholder();
      return `${val.length} sélectionné(s)`;
    }
    const match = this.options().find(o => o.value === val);
    return match ? match.label : this.placeholder();
  });

  selectedOptionIcon = computed(() => {
    if (this.multiple()) return null;
    const match = this.options().find(o => o.value === this.selectedValue());
    return match?.icon || null;
  });

  writeValue(val: any): void {
    this.selectedValue.set(val);
  }

  registerOnChange(fn: (val: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  toggleOpen(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled() && !this.isDisabled()) {
      const willOpen = !this.isOpen();
      if (willOpen) {
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        this.openUpward.set(spaceBelow < 250 && spaceAbove > spaceBelow);

        setTimeout(() => {
          this.elementRef.nativeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, 50);
      }
      this.isOpen.set(willOpen);
      if (!willOpen) {
        this.onTouched();
      }
    }
  }

  selectOption(option: SelectOption, event: MouseEvent): void {
    event.stopPropagation();
    if (option.disabled) return;

    if (this.multiple()) {
      const current: any[] = Array.isArray(this.selectedValue()) ? [...this.selectedValue()] : [];
      const idx = current.indexOf(option.value);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(option.value);
      }
      this.selectedValue.set(current);
      this.onChange(current);
      this.selectionChange.emit(current);
    } else {
      this.selectedValue.set(option.value);
      this.onChange(option.value);
      this.selectionChange.emit(option.value);
      this.isOpen.set(false);
    }
  }

  isSelected(optionValue: any): boolean {
    const val = this.selectedValue();
    if (this.multiple() && Array.isArray(val)) {
      return val.includes(optionValue);
    }
    return val === optionValue;
  }

  onSearchInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.filterQuery.set(q);
  }

  onDocumentClick(event: MouseEvent): void {
    this.isOpen.set(false);
  }
}
