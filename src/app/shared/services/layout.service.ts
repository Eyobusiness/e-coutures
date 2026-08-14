import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // Sidebar state on desktop (collapsed or fully expanded)
  isSidebarCollapsed = signal<boolean>(false);

  // Sidebar state on mobile/tablets (drawer opened or closed)
  isMobileSidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(state => !state);
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update(state => !state);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
