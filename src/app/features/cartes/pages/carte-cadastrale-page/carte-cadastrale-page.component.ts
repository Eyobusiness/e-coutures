import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  viewChild
} from '@angular/core';
import * as L from 'leaflet';
import { CarteService } from '../../services/carte.service';
import {
  CouturierCarteItem,
  CouturierCarteDetail,
  AtelierCarteItem
} from '../../models/carte.model';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SearchComponent } from '../../../../shared/ui/search/search';
import { BadgeComponent } from '../../../../shared/ui/badge/badge';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';
import { CouturierDetailModalComponent } from '../../components/couturier-detail-modal/couturier-detail-modal.component';

@Component({
  selector: 'app-carte-cadastrale-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './carte-cadastrale-page.component.html',
  styleUrl: './carte-cadastrale-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    BadgeComponent,
    LoaderComponent,
    CouturierDetailModalComponent
  ]
})
export class CarteCadastralePageComponent implements OnInit, AfterViewInit, OnDestroy {
  private carteService = inject(CarteService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  readonly mapContainer = viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  readonly couturiers = signal<CouturierCarteItem[]>([]);
  readonly ateliers = signal<AtelierCarteItem[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isDetailLoading = signal<boolean>(false);

  readonly searchQuery = signal<string>('');
  readonly filterType = signal<'all' | 'ateliers' | 'couturiers'>('all');
  readonly activeView = signal<'carte' | 'liste'>('carte');

  readonly isDetailModalOpen = signal<boolean>(false);
  readonly selectedCouturierDetail = signal<CouturierCarteDetail | null>(null);

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;

  readonly filteredCouturiers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.filterType();
    if (type === 'ateliers') return [];

    const items = this.couturiers();
    if (!q) return items;

    return items.filter(
      (c) =>
        c.nomComplet?.toLowerCase().includes(q) ||
        c.ville?.toLowerCase().includes(q) ||
        c.atelierNom?.toLowerCase().includes(q) ||
        c.posteMetier?.toLowerCase().includes(q) ||
        c.telephone?.includes(q)
    );
  });

  readonly filteredAteliers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.filterType();
    if (type === 'couturiers') return [];

    const items = this.ateliers();
    if (!q) return items;

    return items.filter(
      (a) =>
        a.nom?.toLowerCase().includes(q) ||
        a.ville?.toLowerCase().includes(q) ||
        a.adresse?.toLowerCase().includes(q) ||
        a.pays?.toLowerCase().includes(q)
    );
  });

  readonly totalPoints = computed(() => {
    return this.filteredAteliers().length + this.filteredCouturiers().length;
  });

  ngOnInit(): void {
    this.ensureLeafletCssLoaded();
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.activeView() === 'carte') {
      setTimeout(() => this.initMap(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private ensureLeafletCssLoaded(): void {
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }

  loadData(): void {
    this.isLoading.set(true);
    const souscripteurId = this.route.snapshot.queryParamMap.get('souscripteurId');

    const ateliersRequest = this.carteService.getAteliers();

    ateliersRequest.subscribe({
      next: (ateliersRes) => {
        this.ateliers.set(Array.isArray(ateliersRes) ? ateliersRes : []);

        this.carteService.getCouturiers().subscribe({
          next: (couturiersRes) => {
            this.isLoading.set(false);
            this.couturiers.set(Array.isArray(couturiersRes) ? couturiersRes : []);
            setTimeout(() => {
              if (!this.map) {
                this.initMap();
              } else {
                this.map.invalidateSize();
                this.updateMapMarkers();
              }
            }, 100);
          },
          error: (err) => {
            this.isLoading.set(false);
            const msg = err?.error?.message || 'Erreur lors du chargement des couturiers.';
            this.toastService.error(msg, 'Erreur de chargement');
            setTimeout(() => {
              if (!this.map) {
                this.initMap();
              } else {
                this.map.invalidateSize();
                this.updateMapMarkers();
              }
            }, 100);
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des ateliers.';
        this.toastService.error(msg, 'Erreur de chargement');
        setTimeout(() => {
          if (!this.map) {
            this.initMap();
          } else {
            this.map.invalidateSize();
            this.updateMapMarkers();
          }
        }, 100);
      }
    });
  }

  setFilterType(type: 'all' | 'ateliers' | 'couturiers'): void {
    this.filterType.set(type);
    this.updateMapMarkers();
  }

  setView(view: 'carte' | 'liste'): void {
    this.activeView.set(view);
    if (view === 'carte') {
      setTimeout(() => {
        if (!this.map) {
          this.initMap();
        } else {
          this.map.invalidateSize();
          this.updateMapMarkers();
        }
      }, 150);
    }
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.updateMapMarkers();
  }

  openCouturierDetail(employeId: string): void {
    this.selectedCouturierDetail.set(null);
    this.isDetailLoading.set(true);
    this.isDetailModalOpen.set(true);

    this.carteService.getCouturierDetail(employeId).subscribe({
      next: (res) => {
        this.isDetailLoading.set(false);
        this.selectedCouturierDetail.set(res);
      },
      error: (err) => {
        this.isDetailLoading.set(false);
        const msg = err?.error?.message || 'Impossible d\'afficher les détails du couturier.';
        this.toastService.error(msg, 'Erreur');
      }
    });
  }

  private initMap(): void {
    const el = this.mapContainer()?.nativeElement;
    if (!el || this.map) return;

    // Default center: Abidjan, Côte d'Ivoire
    this.map = L.map(el).setView([5.3599517, -4.0082563], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | DigitCouture Cadastre'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    if (!this.map || !this.markersLayer) return;

    this.markersLayer.clearLayers();

    const ateliers = this.filteredAteliers();
    const couturiers = this.filteredCouturiers();
    const bounds = L.latLngBounds([]);

    // Custom Icon helper
    const createCustomIcon = (colorClass: string, iconClass: string) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center shadow-lg border-2 border-white text-base">
                <i class="${iconClass}"></i>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    };

    const atelierIcon = createCustomIcon('bg-indigo-600', 'ti ti-building-store');
    const couturierIcon = createCustomIcon('bg-emerald-600', 'ti ti-user-check');

    // Add Atelier Markers
    ateliers.forEach((a) => {
      if (a.latitude && a.longitude) {
        const latLng = L.latLng(a.latitude, a.longitude);
        bounds.extend(latLng);

        const marker = L.marker(latLng, { icon: atelierIcon });
        const popupContent = `
          <div class="p-2 space-y-1 text-xs">
            <div class="font-bold text-slate-900 text-sm flex items-center gap-1">
              <i class="ti ti-building-store text-indigo-600"></i> ${a.nom}
            </div>
            <div class="text-slate-600">${a.ville} (${a.pays || 'CI'})</div>
            <div class="text-slate-500">${a.adresse || 'Adresse non spécifiée'}</div>
            <div class="pt-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                a.estActif ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }">
                ${a.estActif ? 'Atelier Actif' : 'Inactif'} - Abo: ${a.abonnementStatut || 'N/A'}
              </span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        this.markersLayer?.addLayer(marker);
      }
    });

    // Add Couturier Markers
    couturiers.forEach((c) => {
      if (c.latitude && c.longitude) {
        const latLng = L.latLng(c.latitude, c.longitude);
        bounds.extend(latLng);

        const marker = L.marker(latLng, { icon: couturierIcon });
        const popupContent = document.createElement('div');
        popupContent.className = 'p-2 space-y-1.5 text-xs';
        popupContent.innerHTML = `
          <div class="font-bold text-slate-900 text-sm flex items-center gap-1">
            <i class="ti ti-user text-emerald-600"></i> ${c.nomComplet}
          </div>
          <div class="text-emerald-700 font-semibold text-[11px]">${c.posteMetier || 'Couturier'}</div>
          <div class="text-slate-600">Atelier : <b>${c.atelierNom}</b> (${c.ville})</div>
          <div class="text-slate-500"><i class="ti ti-phone"></i> ${c.telephone || 'N/A'}</div>
          <div class="pt-1">
            <button id="btn-detail-${c.employeId}" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors w-full">
              Voir la fiche détaillée
            </button>
          </div>
        `;

        // Attach event to detail button inside popup
        popupContent.addEventListener('click', (e) => {
          const btn = (e.target as HTMLElement).closest(`#btn-detail-${c.employeId}`);
          if (btn) {
            this.openCouturierDetail(c.employeId);
          }
        });

        marker.bindPopup(popupContent);
        this.markersLayer?.addLayer(marker);
      }
    });

    // Adjust map zoom bounds if we have valid coordinates
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }
}
