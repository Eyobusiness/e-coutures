import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { UtilisateurService } from '../../services/utilisateur.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { Utilisateur, CreateUtilisateurRequest, UpdateUtilisateurRequest } from '../../models/utilisateur.model';
import { ProfileCreateResponse } from '../../../../core/models/profile.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { DialogService } from '../../../../core/services/dialog.service';

import { PageHeaderComponent } from '../../../../shared/ui/page-header/page-header';
import { CardComponent } from '../../../../shared/ui/card/card';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SearchComponent } from '../../../../shared/ui/search/search';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination';
import { LoaderComponent } from '../../../../shared/ui/loader/loader';

import { UtilisateurTableComponent } from '../../components/utilisateur-table/utilisateur-table.component';
import { UtilisateurFormComponent } from '../../components/utilisateur-form/utilisateur-form.component';
import { UtilisateurDetailModalComponent } from '../../components/utilisateur-detail-modal/utilisateur-detail-modal.component';

@Component({
  selector: 'app-utilisateurs-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './utilisateurs-list-page.component.html',
  styleUrl: './utilisateurs-list-page.component.css',
  imports: [
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    SearchComponent,
    PaginationComponent,
    LoaderComponent,
    UtilisateurTableComponent,
    UtilisateurFormComponent,
    UtilisateurDetailModalComponent
  ]
})
export class UtilisateursListPageComponent implements OnInit {
  private utilisateurService = inject(UtilisateurService);
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  readonly admins = signal<Utilisateur[]>([]);
  readonly profiles = signal<ProfileCreateResponse[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly limit = signal<number>(10);
  readonly totalItems = signal<number>(0);

  readonly isFormOpen = signal<boolean>(false);
  readonly isDetailOpen = signal<boolean>(false);
  readonly selectedAdmin = signal<Utilisateur | null>(null);

  readonly filteredAdmins = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.admins();
    if (!q) return items;

    return items.filter((item) =>
      item.firstName?.toLowerCase().includes(q) ||
      item.lastName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadProfiles();
    this.loadAdmins();
  }

  loadProfiles(): void {
    this.profileService.getProfiles().subscribe({
      next: (res) => {
        const list = res?.data || (Array.isArray(res) ? (res as unknown as ProfileCreateResponse[]) : []);
        this.profiles.set(list);
      },
      error: () => {
        this.profiles.set([]);
      }
    });
  }

  loadAdmins(): void {
    this.isLoading.set(true);
    this.utilisateurService.getAll().subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        const rawList: any[] = Array.isArray(res) ? res : (res?.data || []);
        const list: Utilisateur[] = rawList.map((item: any) => ({
          ...item,
          id: item.id || item._id || item.adminId || item.userId || item.uuid || item.code || ''
        }));
        this.admins.set(list);
        this.totalItems.set(list.length);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors du chargement des administrateurs.';
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
    this.selectedAdmin.set(null);
    this.isFormOpen.set(true);
  }

  onOpenEditForm(item: Utilisateur): void {
    this.selectedAdmin.set(item);
    this.isFormOpen.set(true);
  }

  onViewDetails(item: Utilisateur): void {
    this.selectedAdmin.set(item);
    this.isDetailOpen.set(true);
  }

  onSaveAdmin(payload: CreateUtilisateurRequest): void {
    const selected = this.selectedAdmin();
    this.isSaving.set(true);

    if (selected) {
      const adminId = selected.id || (selected as any)._id || (selected as any).adminId || (selected as any).userId || (selected as any).uuid || (selected as any).code;
      if (!adminId) {
        this.isSaving.set(false);
        this.toastService.error('ID de l\'administrateur introuvable.', 'Erreur de modification');
        return;
      }

      const updatePayload: any = {
        id: adminId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        status: payload.status || 'ACTIVATED',
        ...(payload.code ? { code: payload.code } : {}),
        ...(payload.profileId ? { profileId: payload.profileId } : {}),
        ...(payload.password ? { password: payload.password } : {})
      };

      this.utilisateurService.update(adminId, updatePayload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Administrateur mis à jour avec succès !', 'Modification effectuée');
          this.loadAdmins();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la mise à jour de l\'administrateur.';
          this.toastService.error(msg, 'Erreur de modification');
        }
      });
    } else {
      this.utilisateurService.create(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isFormOpen.set(false);
          this.toastService.success('Nouvel administrateur créé avec succès !', 'Création réussie');
          this.loadAdmins();
        },
        error: (err) => {
          this.isSaving.set(false);
          const msg = err?.error?.message || 'Erreur lors de la création de l\'administrateur.';
          this.toastService.error(msg, 'Erreur de création');
        }
      });
    }
  }

  async onDelete(item: Utilisateur): Promise<void> {
    const adminId = item.id || (item as any)._id || (item as any).adminId;
    if (!adminId) {
      this.toastService.error('ID de l\'administrateur introuvable.', 'Erreur de suppression');
      return;
    }

    const confirmed = await this.dialogService.confirmDelete(
      'Supprimer l\'administrateur',
      `Êtes-vous sûr de vouloir supprimer l'administrateur "${item.firstName} ${item.lastName}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    this.isLoading.set(true);
    this.utilisateurService.delete(adminId).subscribe({
      next: () => {
        this.toastService.success('Administrateur supprimé avec succès !', 'Suppression effectuée');
        this.loadAdmins();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || 'Erreur lors de la suppression de l\'administrateur.';
        this.toastService.error(msg, 'Erreur de suppression');
      }
    });
  }
}
