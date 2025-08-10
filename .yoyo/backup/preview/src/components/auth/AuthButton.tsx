
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

const AuthButton = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? (
    <button onClick={() => signOut(auth)}>Logout</button>
  ) : (
    <Link href="/login">Login</Link>
  );
};

export default AuthButton;
