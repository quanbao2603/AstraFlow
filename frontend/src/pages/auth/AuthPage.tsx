import { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterForm } from '../../features/auth/components/RegisterForm';

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register'>('login');

  return (
    <AuthLayout>
      {view === 'login' ? (
        <LoginForm onSwitchView={() => setView('register')} />
      ) : (
        <RegisterForm onSwitchView={() => setView('login')} />
      )}
    </AuthLayout>
  );
}
