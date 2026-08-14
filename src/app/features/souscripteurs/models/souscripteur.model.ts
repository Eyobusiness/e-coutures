export interface Souscripteur {
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
  matricule?: string;
  nomComplet: string;
  email: string;
  telephone: string;
  pays: string;
  devise: string;
  statut: 'actif' | 'inactif' | 'suspendu' | string;

  // Populated abonnement details for UI display
  abonnementNom?: string;
  abonnementId?: string;
}

export interface CreateSouscripteurRequest {
  nomComplet: string;
  email: string;
  telephone: string;
  pays: string;
  devise: string;
  statut: string;
}

export interface UpdateSouscripteurRequest {
  nomComplet: string;
  email: string;
  telephone: string;
  pays: string;
  devise: string;
  statut: string;
}

export interface SouscripteursMeta {
  total: number;
  previous: string | null;
  next: string | null;
  current: string | null;
  limit: number;
}

export interface SouscripteursListResponse {
  meta: SouscripteursMeta;
  data: Souscripteur[];
}
