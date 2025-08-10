'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  FileText, 
  Heart, 
  CreditCard, 
  Settings,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const dashboardCards = [
    {
      title: 'マイ記事',
      description: '作成した記事を管理',
      icon: FileText,
      href: '/dashboard/articles',
      color: 'bg-blue-500',
      stats: '12記事',
    },
    {
      title: 'お気に入り',
      description: 'お気に入りの記事',
      icon: Heart,
      href: '/dashboard/favorites',
      color: 'bg-red-500',
      stats: '8記事',
    },
    {
      title: 'サブスクリプション',
      description: 'プラン管理',
      icon: CreditCard,
      href: '/dashboard/subscription',
      color: 'bg-green-500',
      stats: 'Freeプラン',
    },
    {
      title: '設定',
      description: 'アカウント設定',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'bg-gray-500',
      stats: '',
    },
  ];

  const recentStats = [
    {
      label: '総記事数',
      value: '12',
      icon: FileText,
      change: '+2',
      changeType: 'increase',
    },
    {
      label: '総ビュー数',
      value: '1,234',
      icon: Eye,
      change: '+156',
      changeType: 'increase',
    },
    {
      label: 'フォロワー',
      value: '89',
      icon: Users,
      change: '+5',
      changeType: 'increase',
    },
    {
      label: 'エンゲージメント',
      value: '4.2%',
      icon: TrendingUp,
      change: '+0.3%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              おかえりなさい、{user.user_metadata?.full_name || 'ユーザー'}さん
            </h1>
            <p className="text-gray-600 mt-1">
              ダッシュボードで活動を確認しましょう
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">最終ログイン</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${
                      stat.changeType === 'increase' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      今月
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ダッシュボードカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {card.stats && (
                  <span className="text-sm font-medium text-gray-600">
                    {card.stats}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {card.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* 最近の活動 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          最近の活動
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                新しい記事を投稿しました
              </p>
              <p className="text-xs text-gray-500">2時間前</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                記事にいいねがつきました
              </p>
              <p className="text-xs text-gray-500">5時間前</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                新しいフォロワーが増えました
              </p>
              <p className="text-xs text-gray-500">1日前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
