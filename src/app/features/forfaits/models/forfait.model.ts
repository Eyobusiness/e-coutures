export interface Forfait {
  id: string;
  status?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdById?: string;
  updatedById?: string;
  deletedById?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  nom: string;
  prixMensuel: number;
  prixAnnuel: number;
  nbAteliersMax: number;
  nbUtilisateursMax: number;
  nbCommandesMois?: number;
  stockageMo?: number;
  fonctionnalites?: string;
  estActif: boolean;
}

export interface CreateForfaitRequest {
  nom: string;
  prixMensuel: number;
  prixAnnuel: number;
  nbAteliersMax: number;
  nbUtilisateursMax: number;
  nbCommandesMois?: number;
  stockageMo?: number;
  fonctionnalites?: string;
  estActif: boolean;
}

export interface UpdateForfaitRequest {
  nom: string;
  prixMensuel: number;
  prixAnnuel: number;
  nbAteliersMax: number;
  nbUtilisateursMax: number;
  nbCommandesMois?: number;
  stockageMo?: number;
  fonctionnalites?: string;
  estActif: boolean;
}

export interface ForfaitsMeta {
  total: number;
  previous: string | null;
  next: string | null;
  current: string | null;
  limit: number;
}

export interface ForfaitsListResponse {
  meta: ForfaitsMeta;
  data: Forfait[];
}
