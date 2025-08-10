
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContextType } from '../types/auth';

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateEmail: async () => {},
  updatePassword: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ログイン
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      throw err;
    }
  }, []);

  // 新規登録
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('アカウントの作成に失敗しました。');
      throw err;
    }
  }, []);

  // ログアウト
  const signOut = useCallback(async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      setError('ログアウト中にエラーが発生しました。');
      throw err;
    }
  }, []);

  // パスワードリセット
  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError('パスワードリセットメールの送信に失敗しました。');
      throw err;
    }
  }, []);

  // メールアドレス更新
  const updateEmail = useCallback(async (newEmail: string) => {
    if (!user) throw new Error('ユーザーがログインしていません。');
    
    try {
      setError(null);
      await firebaseUpdateEmail(user, newEmail);
    } catch (err) {
      setError('メールアドレスの更新に失敗しました。');
      throw err;
    }
  }, [user]);

  // パスワード更新
  const updatePassword = useCallback(async (newPassword: string) => {
    if (!user) throw new Error('ユーザーがログインしていません。');
    
    try {
      setError(null);
      await firebaseUpdatePassword(user, newPassword);
    } catch (err) {
      setError('パスワードの更新に失敗しました。');
      throw err;
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
