export type PermissionLevel = 'READ' | 'WRITE' | 'DELETE';

export interface ProfileMenuCreateRequest {
  menuId: string;
  permission: string;
  subMenuId?: string;
  profileId?: string;
}

export interface ProfileCreateRequest {
  label: string;
  status: string;
  profileCode: string;
  profileMenus?: ProfileMenuCreateRequest[];
}

export interface SubMenuCreateResponse {
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
  label: string;
  link?: string;
  icon?: string;
  sequence?: string;
  code?: string;
  team?: string;
  menuId?: string;
  permission?: string;
}

export interface ProfileMenuCreateResponse {
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
  menuId?: string;
  label?: string;
  link?: string;
  icon?: string;
  sequence?: string;
  team?: string;
  code?: string;
  permission?: string;
  subMenus?: SubMenuCreateResponse[];
}

export interface ProfileCreateResponse {
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
  menuId?: string;
  label: string;
  link?: string;
  icon?: string;
  sequence?: string;
  team?: string;
  code?: string;
  profileCode?: string;
  permission?: string;
  menus?: ProfileMenuCreateResponse[];
}

export type ProfileResponse = ProfileCreateResponse;
