import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  host: {
    'class': 'block'
  }
})
export class PaginationComponent {
  totalItems = input.required<number>();
  pageSize = input<number>(10);
  currentPage = input<number>(1);
  pageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);
  showPageSize = input<boolean>(true);

  pageChange = output<number>();
  pageSizeChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / (this.pageSize() || 1)) || 1);

  startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endItem = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 1;
    const range: (number | string)[] = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  });

  setPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeSelect(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(newSize);
  }
}
