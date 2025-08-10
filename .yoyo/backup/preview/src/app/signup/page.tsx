'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // シングルユーザーモードのため、サインアップは無効化
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">サインアップは無効化されています</h1>
        <p className="text-gray-600">シングルユーザーモードのため、新規登録は利用できません。</p>
        <Link className="text-indigo-600 underline" href="/login">ログインへ戻る</Link>
      </div>
    </div>
  );
}
