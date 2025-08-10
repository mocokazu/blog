'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isValidEmail } from '@/utils/validation';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

interface PasswordResetFormProps {
  onSuccess?: () => void;
}

export default function PasswordResetForm({ onSuccess }: PasswordResetFormProps) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!isValidEmail(email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        if (error.message.includes('User not found')) {
          setErrors({ email: 'このメールアドレスは登録されていません' });
        } else {
          setErrors({ general: 'パスワードリセットメールの送信に失敗しました。しばらく時間をおいて再度お試しください。' });
        }
      } else {
        setIsSuccess(true);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: '予期しないエラーが発生しました' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    // エラーをクリア
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">メールを送信しました</h2>
            <p className="text-gray-600 mb-6">
              パスワードリセット用のリンクを{email}に送信しました。
              メールをご確認の上、リンクをクリックしてパスワードを再設定してください。
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                メールが届かない場合は、迷惑メールフォルダもご確認ください。
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center text-primary-600 hover:text-primary-500"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                ログインページに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">パスワードリセット</h2>
          <p className="text-gray-600">
            登録されているメールアドレスを入力してください。
            パスワードリセット用のリンクをお送りします。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="relative">
            <Input
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => handleInputChange(e.target.value)}
              error={errors.email}
              placeholder="your@example.com"
              disabled={isLoading}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            className="w-full"
          >
            リセットメールを送信
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
