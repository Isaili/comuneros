export type UserRole = 'ADMIN' | 'SECRETARY';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
