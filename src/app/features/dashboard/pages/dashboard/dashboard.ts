import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { StatsOverview, StatsPaiements } from '../../models/stats.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { StatCardComponent } from '../../../../shared/ui/stat-card/stat-card';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    CardComponent,
    StatCardComponent,
    LoaderComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private statsService = inject(StatsService);
  private toastService = inject(ToastService);

  readonly overview = signal<StatsOverview | null>(null);
  readonly paiementsStats = signal<StatsPaiements | null>(null);
  readonly isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);

    this.statsService.getOverview().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.overview.set(res.data);
        } else if (res && typeof res === 'object' && 'souscripteursTotal' in res) {
          this.overview.set(res as unknown as StatsOverview);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors de la récupération des données de synthèse.';
        this.toastService.error(msg, 'Erreur Dashboard');
      }
    });

    this.statsService.getPaiementsStats().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.paiementsStats.set(res.data);
        } else if (res && typeof res === 'object' && 'parMoyenPaiement' in res) {
          this.paiementsStats.set(res as unknown as StatsPaiements);
        }
      },
      error: () => {
        // Silent fallback for payment stats if endpoint not ready
      }
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount || 0);
  }

  calculatePercentage(part: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
  }
}
