'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isValidEmail, isStrongPassword } from '@/utils/validation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function SignupForm({ onSuccess, redirectTo }: SignupFormProps) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    const requirements = [
      { test: password.length >= 8, label: '8文字以上' },
      { test: /[A-Z]/.test(password), label: '大文字を含む' },
      { test: /[a-z]/.test(password), label: '小文字を含む' },
      { test: /\d/.test(password), label: '数字を含む' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: '特殊文字を含む' },
    ];

    const passedCount = requirements.filter(req => req.test).length;
    return { requirements, strength: passedCount };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = '名前を入力してください';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = '名前は2文字以上で入力してください';
    }

    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (!isStrongPassword(formData.password)) {
      newErrors.password = 'パスワードは8文字以上で、大文字・小文字・数字を含む必要があります';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認を入力してください';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '利用規約に同意してください';
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
      const { error } = await signUp(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ email: 'このメールアドレスは既に登録されています' });
        } else if (error.message.includes('Password should be at least')) {
          setErrors({ password: 'パスワードが要件を満たしていません' });
        } else {
          setErrors({ general: 'アカウント作成に失敗しました。しばらく時間をおいて再度お試しください。' });
        }
      } else {
        // サインアップ成功
        setErrors({ 
          general: '確認メールを送信しました。メールをご確認の上、アカウントを有効化してください。' 
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: '予期しないエラーが発生しました' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">新規登録</h2>
          <p className="text-gray-600">アカウントを作成してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className={`border rounded-md p-3 ${
              errors.general.includes('確認メール') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                errors.general.includes('確認メール') 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {errors.general}
              </p>
            </div>
          )}

          <div className="relative">
            <Input
              label="お名前"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              error={errors.fullName}
              placeholder="山田 太郎"
              disabled={isLoading}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <Input
              label="メールアドレス"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="your@example.com"
              disabled={isLoading}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <Input
              label="パスワード"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="パスワードを入力"
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* パスワード強度インジケーター */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      passwordStrength.strength >= level
                        ? passwordStrength.strength <= 2
                          ? 'bg-red-500'
                          : passwordStrength.strength <= 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="space-y-1">
                {passwordStrength.requirements.map((req, index) => (
                  <div key={index} className="flex items-center text-xs">
                    {req.test ? (
                      <Check className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3 w-3 text-gray-400 mr-1" />
                    )}
                    <span className={req.test ? 'text-green-600' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <Input
              label="パスワード確認"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="パスワードを再入力"
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              disabled={isLoading}
            />
            <div className="ml-3">
              <label className="text-sm text-gray-600">
                <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                  利用規約
                </Link>
                および
                <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                  プライバシーポリシー
                </Link>
                に同意します
              </label>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-600 mt-1">{errors.agreeToTerms}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            className="w-full"
          >
            アカウントを作成
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              既にアカウントをお持ちの方は{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
