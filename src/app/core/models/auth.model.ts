export interface LoginAdminRequest {
  username: string;
  password: string;
  pusher?: string;
}

export interface RefreshAdminRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  token: string;
  code: string;
}

export interface PasswordApiResponse {
  message: string;
  token: string;
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  password: string;
  oldPassword: string;
}

export interface VerifyPasswordRequest {
  email: string;
  token: string;
  code: string;
}

export interface SubMenuItem {
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
  link: string;
  icon?: string;
  sequence?: string;
  code?: string;
  team?: string;
  menuId?: string;
  permission?: string;
}

export interface MenuItem {
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
  link: string;
  icon?: string;
  sequence?: string;
  team?: string;
  code?: string;
  permission?: string;
  subMenus?: SubMenuItem[];
}

export interface UserProfile {
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
  permission?: string;
  menus?: MenuItem[];
}

export interface AuthAdminResponse {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  code: string;
  profileId: string;
  token: string;
  refresh: string;
  profile: UserProfile;
}
