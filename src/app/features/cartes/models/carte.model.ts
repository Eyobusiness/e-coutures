export interface CouturierCarteItem {
  employeId: string;
  nomComplet: string;
  telephone: string;
  email: string;
  posteMetier: string;
  atelierId: string;
  atelierNom: string;
  ville: string;
  latitude: number;
  longitude: number;
}

export interface CouturierCarteDetail {
  employeId: string;
  nomComplet: string;
  telephone: string;
  email: string;
  photoUrl: string;
  posteMetier: string;
  libellePoste: string;
  typeContrat: string;
  estActif: boolean;
  atelierId: string;
  atelierNom: string;
  atelierVille: string;
  atelierAdresse: string;
  latitude: number;
  longitude: number;
  qrPayload: string;
}

export interface AtelierCarteItem {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  adresse: string;
  latitude: number;
  longitude: number;
  estActif: boolean;
  souscripteurId: string;
  abonnementId: string;
  abonnementStatut: string;
}
