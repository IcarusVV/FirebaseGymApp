export type TokenResponse = {
  token: string;
};

export interface AuthUser {
  id: number;
  username: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}
