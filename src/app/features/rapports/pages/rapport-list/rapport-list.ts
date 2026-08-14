import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RapportService } from '../../services/rapport.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SelectComponent } from '../../../../shared/ui/select/select';
import { InputComponent } from '../../../../shared/ui/input/input';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

@Component({
  selector: 'app-rapport-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rapport-list.html',
  styleUrl: './rapport-list.css',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SelectComponent,
    InputComponent,
    BadgeComponent,
    LoaderComponent
  ]
})
export class RapportList implements OnInit {
  private fb = inject(FormBuilder);
  private rapportService = inject(RapportService);
  private toastService = inject(ToastService);

  readonly rawEntities = signal<string[]>([]);
  readonly isLoadingEntities = signal<boolean>(false);
  readonly isExportingPdf = signal<boolean>(false);
  readonly isExportingExcel = signal<boolean>(false);

  form = this.fb.group({
    entity: [''],
    dateDebut: [''],
    dateFin: ['']
  });

  readonly entityOptions = computed(() => {
    const list = this.rawEntities();
    if (!list.length) {
      return [
        { label: 'Toutes les entités', value: '' },
        { label: 'Souscripteurs', value: 'souscripteurs' },
        { label: 'Abonnements', value: 'abonnements' },
        { label: 'Factures', value: 'factures' },
        { label: 'Ateliers', value: 'ateliers' },
        { label: 'Utilisateurs', value: 'utilisateurs' }
      ];
    }

    return [
      { label: 'Toutes les entités', value: '' },
      ...list.map((e) => ({
        label: this.capitalize(e),
        value: e
      }))
    ];
  });

  ngOnInit(): void {
    this.loadEntities();
  }

  loadEntities(): void {
    this.isLoadingEntities.set(true);
    this.rapportService.getEntities().subscribe({
      next: (res) => {
        this.isLoadingEntities.set(false);
        this.rawEntities.set(Array.isArray(res) ? res : []);
      },
      error: () => {
        this.isLoadingEntities.set(false);
        // Fallback default list if backend endpoint returns error
        this.rawEntities.set(['souscripteurs', 'abonnements', 'factures', 'ateliers', 'utilisateurs']);
      }
    });
  }

  exportPdf(customEntity?: string): void {
    const val = this.form.value;
    const entityToUse = customEntity !== undefined ? customEntity : val.entity || '';

    this.isExportingPdf.set(true);
    this.rapportService.downloadPdf({
      entity: entityToUse,
      dateDebut: val.dateDebut || undefined,
      dateFin: val.dateFin || undefined
    }).subscribe({
      next: (blob) => {
        this.isExportingPdf.set(false);
        const fileName = `Rapport_${entityToUse || 'Global'}_${new Date().toISOString().split('T')[0]}.pdf`;
        this.downloadFile(blob, fileName, 'application/pdf');
        this.toastService.success('Le rapport PDF a été généré et téléchargé.', 'Export PDF Réussi');
      },
      error: (err) => {
        this.isExportingPdf.set(false);
        const msg = err?.error?.message || 'Erreur lors de la génération du rapport PDF.';
        this.toastService.error(msg, 'Erreur d\'export PDF');
      }
    });
  }

  exportExcel(customEntity?: string): void {
    const val = this.form.value;
    const entityToUse = customEntity !== undefined ? customEntity : val.entity || '';

    this.isExportingExcel.set(true);
    this.rapportService.downloadExcel({
      entity: entityToUse,
      dateDebut: val.dateDebut || undefined,
      dateFin: val.dateFin || undefined
    }).subscribe({
      next: (blob) => {
        this.isExportingExcel.set(false);
        const fileName = `Rapport_${entityToUse || 'Global'}_${new Date().toISOString().split('T')[0]}.xlsx`;
        this.downloadFile(blob, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.toastService.success('Le fichier Excel a été généré et téléchargé.', 'Export Excel Réussi');
      },
      error: (err) => {
        this.isExportingExcel.set(false);
        const msg = err?.error?.message || 'Erreur lors de la génération du rapport Excel.';
        this.toastService.error(msg, 'Erreur d\'export Excel');
      }
    });
  }

  private downloadFile(blob: Blob, fileName: string, fallbackType: string): void {
    const fileBlob = blob.type ? blob : new Blob([blob], { type: fallbackType });
    const url = window.URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
