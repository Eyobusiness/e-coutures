import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { FactureAbonnementService } from '../../../factures-abonnement/services/facture-abonnement.service';
import { FactureAbonnement, PayFactureRequest } from '../../../factures-abonnement/models/facture-abonnement.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SearchComponent } from '../../../../shared/ui/search/search';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

import { FactureTableComponent } from '../../../factures-abonnement/components/facture-table/facture-table.component';
import { FacturePayModalComponent } from '../../../factures-abonnement/components/facture-pay-modal/facture-pay-modal.component';
import { FactureDetailModalComponent } from '../../../factures-abonnement/components/facture-detail-modal/facture-detail-modal.component';
import { FactureRecuModalComponent } from '../../../factures-abonnement/components/facture-recu-modal/facture-recu-modal.component';

@Component({
  selector: 'app-paiements-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './paiements-list-page.component.html',
  styleUrl: './paiements-list-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    PaginationComponent,
    LoaderComponent,
    FactureTableComponent,
    FacturePayModalComponent,
    FactureDetailModalComponent,
    FactureRecuModalComponent
  ]
})
export class PaiementsListPageComponent implements OnInit {
  private factureService = inject(FactureAbonnementService);
  private toastService = inject(ToastService);

  readonly factures = signal<FactureAbonnement[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly searchQuery = signal<string>('');
  readonly activeFilter = signal<'ALL' | 'PAYEE' | 'EN_ATTENTE'>('ALL');
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly totalItems = signal<number>(0);

  readonly isPayOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);
  readonly isRecuOpen = signal<boolean>(false);
  readonly selectedFacture = signal<FactureAbonnement | null>(null);

  readonly countPayees = computed(() =>
    this.factures().filter(f => f.statut === 'payee').length
  );

  readonly countEnAttente = computed(() =>
    this.factures().filter(f => f.statut === 'en_attente').length
  );

  readonly montantTotalPaye = computed(() =>
    this.factures()
      .filter(f => f.statut === 'payee')
      .reduce((sum, f) => sum + (f.montant || 0), 0)
  );

  readonly filteredFactures = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();
    let list = this.factures();

    if (filter === 'PAYEE') {
      list = list.filter(f => f.statut === 'payee');
    } else if (filter === 'EN_ATTENTE') {
      list = list.filter(f => f.statut === 'en_attente');
    }

    if (!q) return list;

    return list.filter((item) =>
      item.refTransaction?.toLowerCase().includes(q) ||
      item.moyenPaiement?.toLowerCase().includes(q) ||
      item.souscripteurNom?.toLowerCase().includes(q) ||
      item.forfaitNom?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadFactures();
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
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des règlements.';
        this.toastService.error(msg, 'Erreur de chargement');
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadFactures();
  }

  onOpenPayModal(): void {
    const enAttente = this.factures().find(f => f.statut === 'en_attente');
    if (enAttente) {
      this.selectedFacture.set(enAttente);
    } else {
      this.selectedFacture.set(this.factures()[0] || null);
    }
    this.isPayOpen.set(true);
  }

  onOpenPayModalFor(item: FactureAbonnement): void {
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

  onConfirmPayment(payload: PayFactureRequest): void {
    const selected = this.selectedFacture();
    if (!selected) return;

    this.isSaving.set(true);
    this.factureService.pay(selected.id, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isPayOpen.set(false);
        this.toastService.success('Paiement enregistré avec succès !', 'Paiement Validé');
        this.loadFactures();
      },
      error: (err) => {
        this.isSaving.set(false);
        const msg = err?.error?.message || 'Erreur lors de l\'enregistrement du paiement.';
        this.toastService.error(msg, 'Erreur de traitement');
      }
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount || 0);
  }
}
