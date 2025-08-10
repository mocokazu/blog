'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  FileText,
  Heart,
  CreditCard,
  Shield
} from 'lucide-react';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/login"
          className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
        >
          ログイン
        </Link>
        <Link
          href="/auth/signup"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          新規登録
        </Link>
      </div>
    );
  }

  const menuItems = [
    {
      icon: User,
      label: 'プロフィール',
      href: '/profile',
    },
    {
      icon: FileText,
      label: 'マイ記事',
      href: '/dashboard/articles',
    },
    {
      icon: Heart,
      label: 'お気に入り',
      href: '/dashboard/favorites',
    },
    {
      icon: CreditCard,
      label: 'サブスクリプション',
      href: '/dashboard/subscription',
    },
    {
      icon: Settings,
      label: '設定',
      href: '/dashboard/settings',
    },
  ];

  // 管理者の場合は管理メニューを追加
  if (user.user_metadata?.role === 'admin') {
    menuItems.push({
      icon: Shield,
      label: '管理画面',
      href: '/admin',
    });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-primary-600" />
        </div>
        <span className="hidden sm:block font-medium">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* ユーザー情報 */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.user_metadata?.full_name || 'ユーザー'}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          {/* メニューアイテム */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* サインアウト */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-3" />
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
