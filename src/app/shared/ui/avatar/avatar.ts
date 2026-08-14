import { Component, input, computed, signal } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | null;

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  host: {
    'class': 'inline-block relative'
  }
})
export class AvatarComponent {
  src = input<string | null>(null);
  alt = input<string>('Avatar');
  initials = input<string | null>(null);
  size = input<AvatarSize>('md');
  variant = input<AvatarVariant>('circle');
  status = input<AvatarStatus>(null);
  badgeText = input<string | null>(null);

  imageError = signal<boolean>(false);

  hasImage = computed(() => !!this.src() && !this.imageError());

  computedInitials = computed(() => {
    if (this.initials()) return this.initials()!.toUpperCase().slice(0, 2);
    if (this.alt()) {
      const parts = this.alt().trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return this.alt().slice(0, 2).toUpperCase();
    }
    return '?';
  });

  onImageError(): void {
    this.imageError.set(true);
  }
}
