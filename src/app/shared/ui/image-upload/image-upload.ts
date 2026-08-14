import { Component, input, output, signal, computed } from '@angular/core';

export type AspectRatio = 'square' | 'portrait' | 'landscape' | 'banner';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
  host: {
    'class': 'block'
  }
})
export class ImageUploadComponent {
  label = input<string | null>('Image de couverture / Modèle');
  currentImageUrl = input<string | null>(null);
  aspectRatio = input<AspectRatio>('square');
  disabled = input<boolean>(false);
  placeholderText = input<string>('Téléverser une image');

  imageSelected = output<File>();
  imageRemoved = output<void>();

  localPreviewUrl = signal<string | null>(null);
  isDragging = signal<boolean>(false);

  displayUrl = computed(() => this.localPreviewUrl() || this.currentImageUrl());

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (this.disabled()) return;

    if (event.dataTransfer?.files?.length) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.processFile(file);
      }
    }
  }

  onFileChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files?.length) {
      const file = inputEl.files[0];
      if (file.type.startsWith('image/')) {
        this.processFile(file);
      }
    }
  }

  private processFile(file: File): void {
    if (this.localPreviewUrl()) {
      URL.revokeObjectURL(this.localPreviewUrl()!);
    }
    const preview = URL.createObjectURL(file);
    this.localPreviewUrl.set(preview);
    this.imageSelected.emit(file);
  }

  removeImage(event: MouseEvent): void {
    event.stopPropagation();
    if (this.localPreviewUrl()) {
      URL.revokeObjectURL(this.localPreviewUrl()!);
      this.localPreviewUrl.set(null);
    }
    this.imageRemoved.emit();
  }
}
