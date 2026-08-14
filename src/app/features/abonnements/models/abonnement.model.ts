export interface Abonnement {
  id: string;
  status: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdById?: string;
  updatedById?: string;
  deletedById?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  souscripteurId: string;
  forfaitId: string;
  statut: 'en_essai' | 'actif' | 'inactif' | 'expire' | 'suspendu' | string;
  dateDebut: string;
  dateFin: string;
  renouvellementAuto: boolean;
  periode: 'mensuel' | 'annuel' | string;

  // Helper labels populated in UI
  souscripteurNom?: string;
  forfaitNom?: string;
  montant?: number;
}

export interface CreateAbonnementRequest {
  souscripteurId: string;
  forfaitId: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
  renouvellementAuto: boolean;
  periode: string;
}

export interface UpdateAbonnementRequest {
  souscripteurId: string;
  forfaitId: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
  renouvellementAuto: boolean;
  periode: string;
}

export interface AbonnementsMeta {
  total: number;
  previous: string | null;
  next: string | null;
  current: string | null;
  limit: number;
}

export interface AbonnementsListResponse {
  meta: AbonnementsMeta;
  data: Abonnement[];
}
