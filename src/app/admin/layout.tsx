'use client';

import { ReactNode } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthGuard>
  );
}
