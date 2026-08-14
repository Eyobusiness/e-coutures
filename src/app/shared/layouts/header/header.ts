import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarComponent } from '../../ui/avatar/avatar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AvatarComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class Header {
  protected layoutService = inject(LayoutService);
  protected authService = inject(AuthService);

  isDropdownOpen = signal<boolean>(false);

  toggleSidebar(event: Event): void {
    event.preventDefault();
    if (window.innerWidth <= 768) {
      this.layoutService.toggleMobileSidebar();
    } else {
      this.layoutService.toggleSidebar();
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  onLogout(): void {
    this.closeDropdown();
    this.authService.logout();
  }

  onDocumentClick(event: MouseEvent): void {
    this.isDropdownOpen.set(false);
  }
}
