export interface EnrollmentRequest {
  email: string;
  password?: string;
  nomComplet: string;
  telephone: string;
  pays: string;
  devise: string;
  forfaitId: string;
  periode: 'mensuel' | 'annuel';
  renouvellementAuto: boolean;
  facturePayee: boolean;
  atelierNom: string;
  atelierAdresse?: string;
  atelierVille?: string;
  atelierTelephone?: string;
  atelierEmail?: string;
  latitude?: number;
  longitude?: number;
}

export interface EnrollmentResponse {
  subscriberId: string;
  subscriberEmail: string;
  souscripteurId: string;
  matricule: string;
  abonnementId: string;
  factureId: string;
  atelierId: string;
  atelierNom: string;
  message: string;
}
