export interface FactureAbonnement {
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
  abonnementId: string;
  montant: number;
  devise: string;
  statut: 'en_attente' | 'payee' | 'annulee' | 'en_retard' | string;
  dateEcheance: string;
  datePaiement?: string;
  moyenPaiement?: string;
  refTransaction?: string;
  pdfUrl?: string;

  // Populated UI display fields
  abonnementNom?: string;
  souscripteurNom?: string;
  forfaitNom?: string;
}

export interface CreateFactureRequest {
  abonnementId: string;
  montant: number;
  devise: string;
  statut: string;
  dateEcheance: string;
  datePaiement?: string;
  moyenPaiement?: string;
  refTransaction?: string;
  pdfUrl?: string;
}

export interface UpdateFactureRequest {
  abonnementId: string;
  montant: number;
  devise: string;
  statut: string;
  dateEcheance: string;
  datePaiement?: string;
  moyenPaiement?: string;
  refTransaction?: string;
  pdfUrl?: string;
}

export interface PayFactureRequest {
  moyenPaiement: string;
  refTransaction: string;
}

export interface FacturesMeta {
  total: number;
  previous: string | null;
  next: string | null;
  current: string | null;
  limit: number;
}

export interface FacturesListResponse {
  meta: FacturesMeta;
  data: FactureAbonnement[];
}
