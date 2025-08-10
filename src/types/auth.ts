import { User as FirebaseUser } from 'firebase/auth';

export interface AuthUser extends FirebaseUser {
  // 必要に応じて追加のユーザー情報をここに追加
  // 例: role?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}
