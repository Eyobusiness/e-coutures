export interface MoyenPaiementStat {
  moyenPaiement: string;
  count: number;
  montant: number;
}

export interface StatsPaiements {
  from?: string;
  to?: string;
  nbFacturesPayees: number;
  nbFacturesEnAttente: number;
  montantPaye: number;
  montantEnAttente: number;
  parMoyenPaiement: MoyenPaiementStat[];
}

export interface StatsOverview {
  souscripteursTotal: number;
  souscripteursActifs: number;
  abonnementsTotal: number;
  abonnementsActifs: number;
  abonnementsEnRetard: number;
  ateliersTotal: number;
  ateliersActifs: number;
  subscribersAuthTotal: number;
  facturesTotal: number;
  facturesPayees: number;
  facturesEnAttente: number;
  montantPaye: number;
  montantEnAttente: number;
  abonnementsParStatut?: Record<string, number>;
  facturesParStatut?: Record<string, number>;
}

export interface QuotaSouscripteur {
  souscripteurId: string;
  souscripteurNom: string;
  forfaitNom: string;
  nbAteliersMax: number;
  nbAteliers: number;
}

export interface StatsWorkshops {
  total: number;
  actifs: number;
  avecGps: number;
  parPays: Record<string, number>;
  parVille: Record<string, number>;
  quotasParSouscripteur: QuotaSouscripteur[];
}
