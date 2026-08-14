export interface SubMenuResponse {
  order?: number;
  id?: string | null;
  libelle?: string;
  label?: string;
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
  link?: string;
  path?: string;
  icon?: string;
  sequence?: string;
  code?: string;
  team?: string;
  menuId?: string;
  permission?: string | null;
  reference?: string;
}

export interface MenuResponse {
  order?: number;
  id?: string | null;
  libelle?: string;
  label?: string;
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
  link?: string;
  path?: string;
  icon?: string;
  sequence?: string;
  team?: string;
  code?: string;
  permission?: string | null;
  subMenus?: SubMenuResponse[];
  sousMenus?: SubMenuResponse[];
  reference?: string;
}
