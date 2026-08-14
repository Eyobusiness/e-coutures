import { Component, input, output, signal, computed } from '@angular/core';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  styleUrl: './table.css',
  host: {
    'class': 'block'
  }
})
export class TableComponent {
  columns = input.required<TableColumn[]>();
  data = input<any[]>([]);
  loading = input<boolean>(false);
  emptyMessage = input<string>('Aucune donnée à afficher dans le tableau.');
  selectable = input<boolean>(false);
  hoverable = input<boolean>(true);
  striped = input<boolean>(false);

  sort = output<{ key: string; direction: 'asc' | 'desc' }>();
  rowClick = output<any>();
  selectionChange = output<any[]>();

  sortKey = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  selectedRows = signal<Set<any>>(new Set());

  allSelected = computed(() => {
    const list = this.data();
    if (!list.length) return false;
    return list.every(item => this.selectedRows().has(item));
  });

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortKey() === column.key) {
      const nextDir = this.sortDirection() === 'asc' ? 'desc' : 'asc';
      this.sortDirection.set(nextDir);
    } else {
      this.sortKey.set(column.key);
      this.sortDirection.set('asc');
    }

    this.sort.emit({ key: column.key, direction: this.sortDirection() });
  }

  toggleSelectAll(): void {
    const set = new Set(this.selectedRows());
    if (this.allSelected()) {
      set.clear();
    } else {
      this.data().forEach(item => set.add(item));
    }
    this.selectedRows.set(set);
    this.selectionChange.emit(Array.from(set));
  }

  toggleSelectRow(row: any, event: Event): void {
    event.stopPropagation();
    const set = new Set(this.selectedRows());
    if (set.has(row)) {
      set.delete(row);
    } else {
      set.add(row);
    }
    this.selectedRows.set(set);
    this.selectionChange.emit(Array.from(set));
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows().has(row);
  }

  getCellValue(row: any, key: string): any {
    return key.split('.').reduce((o, i) => (o ? o[i] : null), row);
  }
}
