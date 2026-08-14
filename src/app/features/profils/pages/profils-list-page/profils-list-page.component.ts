import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { MenuService } from '../../../../core/services/menu.service';
import { ProfileCreateResponse, ProfileCreateRequest } from '../../../../core/models/profile.model';
import { MenuResponse } from '../../../../core/models/menu.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { DialogService } from '../../../../core/services/dialog.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SearchComponent } from '../../../../shared/ui/search/search';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

import { ProfilTableComponent } from '../../components/profil-table/profil-table.component';
import { ProfilFormComponent } from '../../components/profil-form/profil-form.component';
import { ProfilDetailModalComponent } from '../../components/profil-detail-modal/profil-detail-modal.component';

@Component({
  selector: 'app-profils-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profils-list-page.component.html',
  styleUrl: './profils-list-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    PaginationComponent,
    LoaderComponent,
    ProfilTableComponent,
    ProfilFormComponent,
    ProfilDetailModalComponent
  ]
})
export class ProfilsListPageComponent implements OnInit {
  private profileService = inject(ProfileService);
  private menuService = inject(MenuService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  readonly profiles = signal<ProfileCreateResponse[]>([]);
  readonly menus = signal<MenuResponse[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly totalItems = signal<number>(0);

  readonly isFormOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);
  readonly selectedProfile = signal<ProfileCreateResponse | null>(null);

  readonly filteredProfiles = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.profiles();
    if (!q) return items;

    return items.filter((item) =>
      item.label?.toLowerCase().includes(q) ||
      item.profileCode?.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadMenus();
    this.loadProfiles();
  }

  loadMenus(): void {
    this.menuService.getMenus().subscribe({
      next: (res) => {
        const list = res?.data || (Array.isArray(res) ? (res as unknown as MenuResponse[]) : []);
        this.menus.set(list);
      },
      error: () => {
        this.menus.set([]);
      }
    });
  }

  loadProfiles(): void {
    this.isLoading.set(true);
    this.profileService.getProfiles().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        let list: ProfileCreateResponse[] = [];
        if (res && Array.isArray(res.data)) {
          list = res.data;
        } else if (Array.isArray(res)) {
          list = res as unknown as ProfileCreateResponse[];
        }
        this.profiles.set(list);
        this.totalItems.set(list.length);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des profils.';
        this.toastService.error(msg, 'Erreur de chargement');
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onOpenCreateForm(): void {
    this.selectedProfile.set(null);
    this.isFormOpen.set(true);
  }

  onOpenEditForm(item: ProfileCreateResponse): void {
    this.selectedProfile.set(item);
    this.isFormOpen.set(true);
  }

  onViewDetails(item: ProfileCreateResponse): void {
    this.selectedProfile.set(item);
    this.isDetailOpen.set(true);
  }

  onSaveProfile(payload: ProfileCreateRequest): void {
    const selected = this.selectedProfile();
    this.isSaving.set(true);

    if (selected) {
      this.profileService.updateProfile(selected.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Profil mis à jour avec succès !', 'Modification effectuée');
          this.loadProfiles();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la mise à jour du profil.';
          this.toastService.error(msg, 'Erreur de modification');
        }
      });
    } else {
      this.profileService.createProfile(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Nouveau profil créé avec succès !', 'Création réussie');
          this.loadProfiles();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la création du profil.';
          this.toastService.error(msg, 'Erreur de création');
        }
      });
    }
  }

  async onDelete(item: ProfileCreateResponse): Promise<void> {
    const confirmed = await this.dialogService.confirmDelete(
      'Supprimer le profil',
      `Êtes-vous sûr de vouloir supprimer le profil "${item.label}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    this.isLoading.set(true);
    this.profileService.deleteProfile(item.id).subscribe({
      next: () => {
        this.toastService.success('Profil supprimé avec succès !', 'Suppression effectuée');
        this.loadProfiles();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors de la suppression du profil.';
        this.toastService.error(msg, 'Erreur de suppression');
      }
    });
  }
}
