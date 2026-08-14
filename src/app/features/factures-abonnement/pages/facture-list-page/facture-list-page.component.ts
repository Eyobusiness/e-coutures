import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { FactureAbonnementService } from '../../services/facture-abonnement.service';
import { AbonnementService } from '../../../abonnements/services/abonnement.service';
import { SouscripteurService } from '../../../souscripteurs/services/souscripteur.service';
import { ForfaitService } from '../../../forfaits/services/forfait.service';
import {
  FactureAbonnement,
  CreateFactureRequest,
  PayFactureRequest
} from '../../models/facture-abonnement.model';
import { Abonnement } from '../../../abonnements/models/abonnement.model';
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

import { FactureTableComponent } from '../../components/facture-table/facture-table.component';
import { FactureFormComponent } from '../../components/facture-form/facture-form.component';
import { FacturePayModalComponent } from '../../components/facture-pay-modal/facture-pay-modal.component';
import { FactureDetailModalComponent } from '../../components/facture-detail-modal/facture-detail-modal.component';
import { FactureRecuModalComponent } from '../../components/facture-recu-modal/facture-recu-modal.component';

@Component({
  selector: 'app-facture-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facture-list-page.component.html',
  styleUrl: './facture-list-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    PaginationComponent,
    LoaderComponent,
    FactureTableComponent,
    FactureFormComponent,
    FacturePayModalComponent,
    FactureDetailModalComponent,
    FactureRecuModalComponent
  ]
})
export class FactureListPageComponent implements OnInit {
  private factureService = inject(FactureAbonnementService);
  private abonnementService = inject(AbonnementService);
  private souscripteurService = inject(SouscripteurService);
  private forfaitService = inject(ForfaitService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  readonly factures = signal<FactureAbonnement[]>([]);
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
  readonly isPayOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);
  readonly isRecuOpen = signal<boolean>(false);
  readonly selectedFacture = signal<FactureAbonnement | null>(null);

  readonly filteredFactures = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.factures();
    if (!q) return items;

    return items.filter((item) =>
      item.refTransaction?.toLowerCase().includes(q) ||
      item.statut?.toLowerCase().includes(q) ||
      item.moyenPaiement?.toLowerCase().includes(q) ||
      item.souscripteurNom?.toLowerCase().includes(q) ||
      item.abonnementNom?.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadAbonnementsAndSouscripteurs();
    this.loadFactures();
  }

  loadAbonnementsAndSouscripteurs(): void {
    this.forfaitService.getAll(1, 100).subscribe({
      next: (fRes) => {
        const fList = fRes?.data || (Array.isArray(fRes) ? (fRes as unknown as Forfait[]) : []);
        this.forfaits.set(fList);
      }
    });

    this.souscripteurService.getAll(1, 100).subscribe({
      next: (sRes) => {
        const sList = sRes?.data || (Array.isArray(sRes) ? (sRes as unknown as Souscripteur[]) : []);
        this.souscripteurs.set(sList);

        this.abonnementService.getAll(1, 100).subscribe({
          next: (aRes) => {
            const aList = aRes?.data || (Array.isArray(aRes) ? (aRes as unknown as Abonnement[]) : []);
            this.abonnements.set(aList);
            this.mapFacturesWithNames();
          }
        });
      }
    });
  }

  loadFactures(): void {
    this.isLoading.set(true);
    this.factureService.getAll(this.currentPage(), this.limit()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res && Array.isArray(res.data)) {
          this.factures.set(res.data);
          this.totalItems.set(res.meta?.total || res.data.length);
        } else if (Array.isArray(res)) {
          this.factures.set(res as unknown as FactureAbonnement[]);
          this.totalItems.set((res as unknown as FactureAbonnement[]).length);
        } else {
          this.factures.set([]);
          this.totalItems.set(0);
        }
        this.mapFacturesWithNames();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des factures.';
        this.toastService.error(msg, 'Erreur de chargement');
      }
    });
  }

  private mapFacturesWithNames(): void {
    const abos = this.abonnements();
    const souscs = this.souscripteurs();
    if (!abos.length && !souscs.length) return;

    this.factures.update((list) =>
      list.map((f) => {
        const abo = abos.find((a) => a.id === f.abonnementId);
        const sousc = abo ? souscs.find((s) => s.id === abo.souscripteurId) : null;
        return {
          ...f,
          abonnementNom: abo ? `Abonnement ${abo.periode || ''} (${abo.statut})` : undefined,
          souscripteurNom: sousc ? sousc.nomComplet : undefined
        };
      })
    );
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadFactures();
  }

  onOpenCreateForm(): void {
    this.selectedFacture.set(null);
    this.isFormOpen.set(true);
  }

  onOpenEditForm(item: FactureAbonnement): void {
    this.selectedFacture.set(item);
    this.isFormOpen.set(true);
  }

  onOpenPayModal(item: FactureAbonnement): void {
    this.selectedFacture.set(item);
    this.isPayOpen.set(true);
  }

  onViewDetails(item: FactureAbonnement): void {
    this.selectedFacture.set(item);
    this.isDetailOpen.set(true);
  }

  onPrintReceipt(item: FactureAbonnement): void {
    this.selectedFacture.set(item);
    this.isRecuOpen.set(true);
  }

  onSaveFacture(payload: CreateFactureRequest): void {
    const selected = this.selectedFacture();
    this.isSaving.set(true);

    if (selected) {
      this.factureService.update(selected.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Facture mise à jour avec succès !', 'Modification effectuée');
          this.loadFactures();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la mise à jour de la facture.';
          this.toastService.error(msg, 'Erreur de modification');
        }
      });
    } else {
      this.factureService.create(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Nouvelle facture créée avec succès !', 'Création réussie');
          this.loadFactures();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la création de la facture.';
          this.toastService.error(msg, 'Erreur de création');
        }
      });
    }
  }

  onConfirmPayment(payPayload: PayFactureRequest): void {
    const selected = this.selectedFacture();
    if (!selected) return;

    this.isSaving.set(true);
    this.factureService.payer(selected.id, payPayload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isPayOpen.set(false);
        this.toastService.success('Règlement enregistré avec succès !', 'Facture Payée');
        this.loadFactures();
      },
      error: (err) => {
        this.isSaving.set(false);
        const msg = err?.error?.message || 'Erreur lors de l\'enregistrement du paiement.';
        this.toastService.error(msg, 'Erreur de paiement');
      }
    });
  }

  async onDelete(item: FactureAbonnement): Promise<void> {
    const confirmed = await this.dialogService.confirmDelete(
      'Supprimer la facture',
      `Êtes-vous sûr de vouloir supprimer la facture ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    this.isLoading.set(true);
    this.factureService.delete(item.id).subscribe({
      next: () => {
        this.toastService.success('Facture supprimée avec succès !', 'Suppression effectuée');
        this.loadFactures();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors de la suppression de la facture.';
        this.toastService.error(msg, 'Erreur de suppression');
      }
    });
  }
}
