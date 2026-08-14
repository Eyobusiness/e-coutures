import { MenuResponse } from '../../core/models/menu.model';

/**
 * Menu principal utilisé pour la navigation dans l'application.
 */
export const FALLBACK_MENUS: MenuResponse[] = [
  {
    order: 1,
    id: null,
    libelle: "Dashboard",
    icon: "bi bi-speedometer2",
    path: "/dashboard",
    code: "100",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "dashboard"
  },
  {
    order: 2,
    id: null,
    libelle: "Souscripteurs",
    icon: "bi bi-people",
    path: "/souscription",
    code: "200",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "souscription"
  },
  {
    order: 3,
    id: null,
    libelle: "Abonnements",
    icon: "bi bi-lightbulb-fill",
    path: "/abonnement",
    code: "300",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "abonnement"
  },
  {
    order: 4,
    id: null,
    libelle: "Factures",
    icon: "bi bi-file-earmark-text",
    path: "/factures",
    code: "400",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "factures"
  },
  {
    order: 5,
    id: null,
    libelle: "Forfaits",
    icon: "bi bi-box-seam",
    path: "/forfaits",
    code: "500",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "forfaits"
  },
  {
    order: 6,
    id: null,
    libelle: "Rapports",
    icon: "bi bi-bar-chart-line",
    path: "/rapports",
    code: "600",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "rapports"
  },
  {
    order: 7,
    id: null,
    libelle: "Carte Cadastrale",
    icon: "bi bi-map",
    path: "/carte-cadastrale",
    code: "700",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "carte_cadastrale"
  },
  {
    order: 8,
    id: null,
    libelle: "Utilisateurs",
    icon: "bi bi-people-fill",
    path: "#",
    code: "800",
    permission: "1,2,3,4",
    sousMenus: [
      {
        order: 1,
        id: null,
        libelle: "Utilisateurs",
        icon: "bi bi-person",
        path: "/utilisateur",
        code: "800",
        permission: null,
        reference: "utilisateurs"
      },
      {
        order: 2,
        id: null,
        libelle: "Profils",
        icon: "bi bi-shield-check",
        path: "/profils",
        code: "800",
        permission: null,
        reference: "profils"
      }
    ],
    reference: "main_utilisateurs"
  },
  {
    order: 9,
    id: null,
    libelle: "Paramètres Systèmes",
    icon: "bi bi-gear",
    path: "/settings",
    code: "900",
    permission: "1,2,3,4",
    sousMenus: [],
    reference: "parametres"
  }
];
