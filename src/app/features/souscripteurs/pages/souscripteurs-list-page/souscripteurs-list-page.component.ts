import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { SouscripteurService } from '../../services/souscripteur.service';
import { AbonnementService } from '../../../abonnements/services/abonnement.service';
import { ForfaitService } from '../../../forfaits/services/forfait.service';
import {
  Souscripteur,
  CreateSouscripteurRequest
} from '../../models/souscripteur.model';
import { Abonnement } from '../../../abonnements/models/abonnement.model';
import { Forfait } from '../../../forfaits/models/forfait.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { DialogService } from '../../../../core/services/dialog.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SearchComponent } from '../../../../shared/ui/search/search';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

import { SouscripteurTableComponent } from '../../components/souscripteur-table/souscripteur-table.component';
import { SouscripteurFormComponent } from '../../components/souscripteur-form/souscripteur-form.component';
import { SouscripteurDetailModalComponent } from '../../components/souscripteur-detail-modal/souscripteur-detail-modal.component';
import { LinkSubscriptionModalComponent } from '../../../abonnements/components/link-subscription-modal/link-subscription-modal.component';
import { EnrollmentFormComponent } from '../../components/enrollment-form/enrollment-form.component';

@Component({
  selector: 'app-souscripteurs-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './souscripteurs-list-page.component.html',
  styleUrl: './souscripteurs-list-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    PaginationComponent,
    LoaderComponent,
    SouscripteurTableComponent,
    SouscripteurFormComponent,
    SouscripteurDetailModalComponent,
    LinkSubscriptionModalComponent,
    EnrollmentFormComponent
  ]
})
export class SouscripteursListPageComponent implements OnInit {
  private souscripteurService = inject(SouscripteurService);
  private abonnementService = inject(AbonnementService);
  private forfaitService = inject(ForfaitService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  readonly souscripteurs = signal<Souscripteur[]>([]);
  readonly abonnements = signal<Abonnement[]>([]);
  readonly forfaits = signal<Forfait[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly totalItems = signal<number>(0);

  readonly isFormOpen = signal<boolean>(false);
  readonly isLinkOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);
  readonly isEnrollmentModalOpen = signal<boolean>(false);
  readonly selectedSouscripteur = signal<Souscripteur | null>(null);

  readonly filteredSouscripteurs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.souscripteurs();
    if (!q) return items;

    return items.filter((item) =>
      item.nomComplet?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.telephone?.toLowerCase().includes(q) ||
      item.pays?.toLowerCase().includes(q) ||
      item.matricule?.toLowerCase().includes(q) ||
      item.abonnementNom?.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadSouscripteurs();
    this.loadAbonnementsAndForfaits();
  }

  loadSouscripteurs(): void {
    this.isLoading.set(true);
    this.souscripteurService.getAll(this.currentPage(), this.limit()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res && Array.isArray(res.data)) {
          this.souscripteurs.set(res.data);
          this.totalItems.set(res.meta?.total || res.data.length);
        } else if (Array.isArray(res)) {
          this.souscripteurs.set(res as unknown as Souscripteur[]);
          this.totalItems.set((res as unknown as Souscripteur[]).length);
        } else {
          this.souscripteurs.set([]);
          this.totalItems.set(0);
        }
        this.mapSouscripteursWithAbonnements();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des souscripteurs.';
        this.toastService.error(msg, 'Erreur de chargement');
      }
    });
  }

  loadAbonnementsAndForfaits(): void {
    this.forfaitService.getAll(1, 100).subscribe({
      next: (fRes) => {
        const fList = fRes?.data || (Array.isArray(fRes) ? (fRes as unknown as Forfait[]) : []);
        this.forfaits.set(fList);

        this.abonnementService.getAll(1, 100).subscribe({
          next: (aRes) => {
            const aList = aRes?.data || (Array.isArray(aRes) ? (aRes as unknown as Abonnement[]) : []);
            this.abonnements.set(aList);
            this.mapSouscripteursWithAbonnements();
          }
        });
      }
    });
  }

  mapSouscripteursWithAbonnements(): void {
    const abos = this.abonnements();
    const forfaitsList = this.forfaits();
    if (abos.length === 0) return;

    const forfaitMap = new Map(forfaitsList.map(f => [f.id, f.nom]));

    this.souscripteurs.update((list) =>
      list.map((s) => {
        const matchingAbo = abos.find((a) => a.souscripteurId === s.id);
        let forfaitName: string | undefined;

        if (matchingAbo) {
          if (matchingAbo.forfaitNom && !this.isUuid(matchingAbo.forfaitNom)) {
            forfaitName = matchingAbo.forfaitNom;
          } else {
            const matchedFromMap = forfaitMap.get(matchingAbo.forfaitId);
            forfaitName = matchedFromMap || 'Standard';
          }
        }

        return {
          ...s,
          abonnementNom: forfaitName,
          abonnementId: matchingAbo?.id
        };
      })
    );
  }

  private isUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadSouscripteurs();
  }

  onOpenCreateForm(): void {
    this.selectedSouscripteur.set(null);
    this.isFormOpen.set(true);
  }

  onOpenEnrollmentModal(): void {
    this.isEnrollmentModalOpen.set(true);
  }

  onEnrollmentSuccess(): void {
    this.loadSouscripteurs();
    this.loadAbonnementsAndForfaits();
  }

  onOpenEditForm(item: Souscripteur): void {
    this.selectedSouscripteur.set(item);
    this.isFormOpen.set(true);
  }

  onOpenLinkModal(item: Souscripteur): void {
    this.selectedSouscripteur.set(item);
    this.isLinkOpen.set(true);
  }

  onConfirmLink(evt: { selectedId: string }): void {
    const selectedS = this.selectedSouscripteur();
    if (!selectedS) return;

    this.isSaving.set(true);
    this.abonnementService.getById(evt.selectedId).subscribe({
      next: (abo) => {
        const payload = {
          souscripteurId: selectedS.id,
          forfaitId: abo.forfaitId,
          statut: abo.statut,
          dateDebut: abo.dateDebut,
          dateFin: abo.dateFin,
          renouvellementAuto: abo.renouvellementAuto,
          periode: abo.periode
        };

        this.abonnementService.update(abo.id, payload).subscribe({
          next: () => {
            this.isSaving.set(false);
            this.isLinkOpen.set(false);
            this.toastService.success('Abonnement lié au souscripteur avec succès !', 'Association réussie');
            this.loadSouscripteurs();
            this.loadAbonnementsAndForfaits();
          },
          error: (err) => {
            this.isSaving.set(false);
            const msg = err?.error?.message || 'Erreur lors de l\'association de l\'abonnement.';
            this.toastService.error(msg, 'Erreur d\'association');
          }
        });
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.error('Abonnement introuvable pour l\'association.', 'Erreur d\'association');
      }
    });
  }

  onViewDetails(item: Souscripteur): void {
    this.selectedSouscripteur.set(item);
    this.isDetailOpen.set(true);
  }

  onSaveSouscripteur(payload: CreateSouscripteurRequest): void {
    const selected = this.selectedSouscripteur();
    this.isSaving.set(true);

    if (selected) {
      this.souscripteurService.update(selected.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Souscripteur mis à jour avec succès !', 'Modification effectuée');
          this.loadSouscripteurs();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la mise à jour du souscripteur.';
          this.toastService.error(msg, 'Erreur de modification');
        }
      });
    } else {
      this.souscripteurService.create(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Nouveau souscripteur créé avec succès !', 'Création réussie');
          this.loadSouscripteurs();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la création du souscripteur.';
          this.toastService.error(msg, 'Erreur de création');
        }
      });
    }
  }

  async onDelete(item: Souscripteur): Promise<void> {
    const confirmed = await this.dialogService.confirmDelete(
      'Supprimer le souscripteur',
      `Êtes-vous sûr de vouloir supprimer le souscripteur "${item.nomComplet}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    this.isLoading.set(true);
    this.souscripteurService.delete(item.id).subscribe({
      next: () => {
        this.toastService.success('Souscripteur supprimé avec succès !', 'Suppression effectuée');
        this.loadSouscripteurs();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors de la suppression du souscripteur.';
        this.toastService.error(msg, 'Erreur de suppression');
      }
    });
  }
}
