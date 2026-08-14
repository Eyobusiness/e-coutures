export interface RapportExportParams {
  entity?: string;
  dateDebut?: string;
  dateFin?: string;
}

export interface RapportEntityOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}
