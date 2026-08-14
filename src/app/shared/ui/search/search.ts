import { Component, input, output, signal, effect } from '@angular/core';

export type SearchSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrl: './search.css',
  host: {
    'class': 'block'
  }
})
export class SearchComponent {
  placeholder = input<string>('Rechercher...');
  value = input<string>('');
  debounceMs = input<number>(300);
  disabled = input<boolean>(false);
  size = input<SearchSize>('md');

  search = output<string>();
  clear = output<void>();

  searchTerm = signal<string>('');
  private timer: any = null;

  constructor() {
    effect(() => {
      this.searchTerm.set(this.value());
    });
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchTerm.set(val);

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.search.emit(val);
    }, this.debounceMs());
  }

  onClear(): void {
    this.searchTerm.set('');
    if (this.timer) clearTimeout(this.timer);
    this.search.emit('');
    this.clear.emit();
  }
}
