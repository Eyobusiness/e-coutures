import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  host: {
    'class': 'block'
  }
})
export class FileUploadComponent {
  label = input<string | null>('Téléverser des fichiers');
  hint = input<string | null>('Formats acceptés : PDF, PNG, JPG jusqu\'à 10 Mo');
  accept = input<string>('*/*');
  maxSizeMb = input<number>(10);
  multiple = input<boolean>(true);
  disabled = input<boolean>(false);
  files = input<File[]>([]);

  filesSelected = output<File[]>();
  fileRemoved = output<number>();

  isDragging = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

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

    if (event.dataTransfer?.files) {
      this.handleFileList(Array.from(event.dataTransfer.files));
    }
  }

  onFileChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files?.length) {
      this.handleFileList(Array.from(inputEl.files));
    }
  }

  private handleFileList(incomingFiles: File[]): void {
    this.errorMessage.set(null);
    const validFiles: File[] = [];
    const maxBytes = this.maxSizeMb() * 1024 * 1024;

    for (const f of incomingFiles) {
      if (f.size > maxBytes) {
        this.errorMessage.set(`Le fichier "${f.name}" dépasse la taille maximale autorisée de ${this.maxSizeMb()} Mo.`);
        continue;
      }
      validFiles.push(f);
    }

    if (validFiles.length) {
      this.filesSelected.emit(validFiles);
    }
  }

  removeFile(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.fileRemoved.emit(index);
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
