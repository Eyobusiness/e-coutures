import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FALLBACK_MENUS } from '../../constants/navigation';
import { LayoutService } from '../../services/layout.service';
import { MenuService } from '../../../core/services/menu.service';
import { MenuResponse, SubMenuResponse } from '../../../core/models/menu.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit {
  protected layoutService = inject(LayoutService);
  private menuService = inject(MenuService);

  /** Liste des menus */
  protected readonly menus = signal<MenuResponse[]>(FALLBACK_MENUS);

  /** Sous-menus ouverts */
  protected readonly expandedMenus = signal<Record<string, boolean>>({});

  ngOnInit(): void {
    this.menuService.getMenus().subscribe({
      next: (res) => {
        const apiMenus: MenuResponse[] = Array.isArray(res)
          ? (res as unknown as MenuResponse[])
          : (res?.data ?? []);

        if (apiMenus.length > 0) {
          this.menus.set(apiMenus);
        }
      },
      error: () => {
        // En cas d'erreur de chargement API, on garde le menu défini dans FALLBACK_MENUS
      }
    });
  }

  getMenuKey(menu: MenuResponse | SubMenuResponse, fallbackIndex: number): string {
    return menu.reference || menu.code || menu.id || `menu-${fallbackIndex}`;
  }

  getLabel(menu: MenuResponse | SubMenuResponse): string {
    return menu.libelle || menu.label || '';
  }

  getPath(menu: MenuResponse | SubMenuResponse): string {
    const p = menu.path || menu.link || '';
    return p === '#' ? '' : p;
  }

  getIcon(menu: MenuResponse | SubMenuResponse): string {
    return menu.icon || 'bi bi-circle';
  }

  getSubMenus(menu: MenuResponse): SubMenuResponse[] {
    return menu.sousMenus || menu.subMenus || [];
  }

  hasSubMenus(menu: MenuResponse): boolean {
    const list = this.getSubMenus(menu);
    return list.length > 0;
  }

  toggleSubmenu(menuKey: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.expandedMenus.update(state => ({
      ...state,
      [menuKey]: !state[menuKey]
    }));
  }

  isMenuExpanded(menuKey: string): boolean {
    return !!this.expandedMenus()[menuKey];
  }

  handleItemClick(): void {
    this.layoutService.closeMobileSidebar();
  }
}
