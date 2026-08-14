import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { AbonnementService } from '../../services/abonnement.service';
import { SouscripteurService } from '../../../souscripteurs/services/souscripteur.service';
import { ForfaitService } from '../../../forfaits/services/forfait.service';
import { Abonnement, CreateAbonnementRequest } from '../../models/abonnement.model';
import { Souscripteur } from '../../../souscripteurs/models/souscripteur.model';
import { Forfait } from '../../../forfaits/models/forfait.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { DialogService } from '../../../../core/services/dialog.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SearchComponent } from '../../../../shared/ui/search/search';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

import { AbonnementTableComponent } from '../../components/abonnement-table/abonnement-table.component';
import { AbonnementFormComponent } from '../../components/abonnement-form/abonnement-form.component';
import { AbonnementDetailModalComponent } from '../../components/abonnement-detail-modal/abonnement-detail-modal.component';

@Component({
  selector: 'app-abonnement-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './abonnement-list-page.component.html',
  styleUrl: './abonnement-list-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    PaginationComponent,
    LoaderComponent,
    AbonnementTableComponent,
    AbonnementFormComponent,
    AbonnementDetailModalComponent
  ]
})
export class AbonnementListPageComponent implements OnInit {
  private abonnementService = inject(AbonnementService);
  private souscripteurService = inject(SouscripteurService);
  private forfaitService = inject(ForfaitService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  readonly abonnements = signal<Abonnement[]>([]);
  readonly souscripteurs = signal<Souscripteur[]>([]);
  readonly forfaits = signal<Forfait[]>([]);

  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly totalItems = signal<number>(0);

  readonly isFormOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);
  readonly selectedAbonnement = signal<Abonnement | null>(null);

  readonly filteredAbonnements = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.abonnements();
    if (!q) return items;

    return items.filter((item) =>
      item.souscripteurNom?.toLowerCase().includes(q) ||
      item.forfaitNom?.toLowerCase().includes(q) ||
      item.forfaitId?.toLowerCase().includes(q) ||
      item.statut?.toLowerCase().includes(q) ||
      item.periode?.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadSouscripteurs();
    this.loadForfaits();
    this.loadAbonnements();
  }

  loadSouscripteurs(): void {
    this.souscripteurService.getAll(1, 100).subscribe({
      next: (res) => {
        const list = res?.data || (Array.isArray(res) ? (res as unknown as Souscripteur[]) : []);
        this.souscripteurs.set(list);
        this.mapNames();
      },
      error: () => {}
    });
  }

  loadForfaits(): void {
    this.forfaitService.getAll(1, 100).subscribe({
      next: (res) => {
        const list = res?.data || (Array.isArray(res) ? (res as unknown as Forfait[]) : []);
        this.forfaits.set(list);
        this.mapNames();
      },
      error: () => {}
    });
  }

  loadAbonnements(): void {
    this.isLoading.set(true);
    this.abonnementService.getAll(this.currentPage(), this.limit()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res && Array.isArray(res.data)) {
          this.abonnements.set(res.data);
          this.totalItems.set(res.meta?.total || res.data.length);
        } else if (Array.isArray(res)) {
          this.abonnements.set(res as unknown as Abonnement[]);
          this.totalItems.set((res as unknown as Abonnement[]).length);
        } else {
          this.abonnements.set([]);
          this.totalItems.set(0);
        }
        this.mapNames();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des abonnements.';
        this.toastService.error(msg, 'Erreur de chargement');
      }
    });
  }

  private mapNames(): void {
    const sList = this.souscripteurs();
    const fList = this.forfaits();

    this.abonnements.update((list) =>
      list.map((a) => {
        const s = sList.find((item) => item.id === a.souscripteurId);
        const f = fList.find((item) => item.id === a.forfaitId);

        return {
          ...a,
          souscripteurNom: s ? s.nomComplet : undefined,
          forfaitNom: f ? f.nom : undefined
        };
      })
    );
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadAbonnements();
  }

  onOpenCreateForm(): void {
    this.selectedAbonnement.set(null);
    this.isFormOpen.set(true);
  }

  onOpenEditForm(item: Abonnement): void {
    this.selectedAbonnement.set(item);
    this.isFormOpen.set(true);
  }

  onViewDetails(item: Abonnement): void {
    this.selectedAbonnement.set(item);
    this.isDetailOpen.set(true);
  }

  onSaveAbonnement(payload: CreateAbonnementRequest): void {
    const selected = this.selectedAbonnement();
    this.isSaving.set(true);

    if (selected) {
      this.abonnementService.update(selected.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Abonnement mis à jour avec succès !', 'Modification effectuée');
          this.loadAbonnements();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la mise à jour de l\'abonnement.';
          this.toastService.error(msg, 'Erreur de modification');
        }
      });
    } else {
      this.abonnementService.create(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Nouveau abonnement créé avec succès !', 'Création réussie');
          this.loadAbonnements();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la création de l\'abonnement.';
          this.toastService.error(msg, 'Erreur de création');
        }
      });
    }
  }

  async onDelete(item: Abonnement): Promise<void> {
    const confirmed = await this.dialogService.confirmDelete(
      'Supprimer l\'abonnement',
      `Êtes-vous sûr de vouloir supprimer cet abonnement ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    this.isLoading.set(true);
    this.abonnementService.delete(item.id).subscribe({
      next: () => {
        this.toastService.success('Abonnement supprimé avec succès !', 'Suppression effectuée');
        this.loadAbonnements();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors de la suppression de l\'abonnement.';
        this.toastService.error(msg, 'Erreur de suppression');
      }
    });
  }
}
