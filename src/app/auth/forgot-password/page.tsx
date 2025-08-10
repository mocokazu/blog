import { Metadata } from 'next';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

export const metadata: Metadata = {
  title: 'パスワードリセット | Blog Portfolio',
  description: 'パスワードをリセットしてください',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <PasswordResetForm />
      </div>
    </div>
  );
}
