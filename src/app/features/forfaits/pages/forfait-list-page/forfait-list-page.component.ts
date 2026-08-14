import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { ForfaitService } from '../../services/forfait.service';
import { Forfait, CreateForfaitRequest } from '../../models/forfait.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { DialogService } from '../../../../core/services/dialog.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SearchComponent } from '../../../../shared/ui/search/search';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

import { ForfaitTableComponent } from '../../components/forfait-table/forfait-table.component';
import { ForfaitFormComponent } from '../../components/forfait-form/forfait-form.component';
import { ForfaitDetailModalComponent } from '../../components/forfait-detail-modal/forfait-detail-modal.component';

@Component({
  selector: 'app-forfait-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forfait-list-page.component.html',
  styleUrl: './forfait-list-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    PaginationComponent,
    LoaderComponent,
    ForfaitTableComponent,
    ForfaitFormComponent,
    ForfaitDetailModalComponent
  ]
})
export class ForfaitListPageComponent implements OnInit {
  private forfaitService = inject(ForfaitService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  readonly forfaits = signal<Forfait[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly totalItems = signal<number>(0);

  readonly isFormOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);
  readonly selectedForfait = signal<Forfait | null>(null);

  readonly filteredForfaits = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.forfaits();
    if (!q) return items;

    return items.filter((item) =>
      item.nom?.toLowerCase().includes(q) ||
      item.prixMensuel?.toString().includes(q) ||
      item.prixAnnuel?.toString().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadForfaits();
  }

  loadForfaits(): void {
    this.isLoading.set(true);
    this.forfaitService.getAll(this.currentPage(), this.limit()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res && Array.isArray(res.data)) {
          this.forfaits.set(res.data);
          this.totalItems.set(res.meta?.total || res.data.length);
        } else if (Array.isArray(res)) {
          this.forfaits.set(res as unknown as Forfait[]);
          this.totalItems.set((res as unknown as Forfait[]).length);
        } else {
          this.forfaits.set([]);
          this.totalItems.set(0);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des forfaits.';
        this.toastService.error(msg, 'Erreur de chargement');
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadForfaits();
  }

  onOpenCreateForm(): void {
    this.selectedForfait.set(null);
    this.isFormOpen.set(true);
  }

  onOpenEditForm(item: Forfait): void {
    this.selectedForfait.set(item);
    this.isFormOpen.set(true);
  }

  onViewDetails(item: Forfait): void {
    this.selectedForfait.set(item);
    this.isDetailOpen.set(true);
  }

  onSaveForfait(payload: CreateForfaitRequest): void {
    const selected = this.selectedForfait();
    this.isSaving.set(true);

    if (selected) {
      this.forfaitService.update(selected.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Forfait mis à jour avec succès !', 'Modification effectuée');
          this.loadForfaits();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la mise à jour du forfait.';
          this.toastService.error(msg, 'Erreur de modification');
        }
      });
    } else {
      this.forfaitService.create(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Nouveau forfait créé avec succès !', 'Création réussie');
          this.loadForfaits();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la création du forfait.';
          this.toastService.error(msg, 'Erreur de création');
        }
      });
    }
  }

  async onDelete(item: Forfait): Promise<void> {
    const confirmed = await this.dialogService.confirmDelete(
      'Supprimer le forfait',
      `Êtes-vous sûr de vouloir supprimer le forfait "${item.nom}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    this.isLoading.set(true);
    this.forfaitService.delete(item.id).subscribe({
      next: () => {
        this.toastService.success('Forfait supprimé avec succès !', 'Suppression effectuée');
        this.loadForfaits();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors de la suppression du forfait.';
        this.toastService.error(msg, 'Erreur de suppression');
      }
    });
  }
}
