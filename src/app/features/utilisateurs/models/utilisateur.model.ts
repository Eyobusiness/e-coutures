export interface Utilisateur {
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
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  code?: string;
  pushAddress?: string;
  password?: string;
  verificationToken?: string;
  profileId?: string;
}

export interface CreateUtilisateurRequest {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  status?: string;
  code?: string;
  pushAddress?: string;
  password?: string;
  profileId?: string;
}

export interface UpdateUtilisateurRequest {
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  status?: string;
  code?: string;
  pushAddress?: string;
  password?: string;
  profileId?: string;
}

export type UtilisateurStatus = 'ACTIVATED' | 'INACTIVATED' | 'ACTIVE' | 'INACTIVE' | 'ACTIF' | 'INACTIF';
