import { useState, useEffect, createContext, useContext } from 'react';
// import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  user: any | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 認証状態を管理するカスタムフック
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * 認証フックの実装
 */
export function useAuthState() {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // モック実装：一時的にローディングを終了
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    // モック実装：テスト用ユーザーでログイン
    if (email === 'test@example.com' && password === 'password') {
      const mockUser = {
        id: 'mock-user-id',
        email: 'test@example.com',
        user_metadata: { full_name: 'テストユーザー' }
      };
      setUser(mockUser);
      setSession({ user: mockUser });
      return { error: null };
    }
    return { error: { message: 'Invalid credentials' } };
  };

  const signUp = async (email: string, password: string) => {
    // モック実装：常に成功
    return { error: null };
  };

  const signOut = async () => {
    // モック実装：ユーザーをクリア
    setUser(null);
    setSession(null);
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
