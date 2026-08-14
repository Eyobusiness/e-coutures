export interface Payment {
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
  atelierId?: string;
  commandeId?: string;
  recuPar?: string;
  montant: number;
  moyen: string;
  refTransaction?: string;
  statut?: string;
  datePaiement?: string;
}

export interface CreatePaymentRequest {
  atelierId?: string;
  commandeId?: string;
  recuPar?: string;
  montant: number;
  moyen: string;
  refTransaction?: string;
  statut?: string;
  datePaiement?: string;
}

export interface UpdatePaymentRequest {
  atelierId?: string;
  commandeId?: string;
  recuPar?: string;
  montant?: number;
  moyen?: string;
  refTransaction?: string;
  statut?: string;
  datePaiement?: string;
}

export interface PaymentsMeta {
  total: number;
  previous?: string | null;
  next?: string | null;
  current?: string | null;
  limit: number;
}

export interface PaymentsListResponse {
  meta: PaymentsMeta;
  data: Payment[];
}
