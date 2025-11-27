'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginButton from '@/components/auth/LoginButton';
import Loading from '@/components/common/Loading';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from 'antd';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <Loading fullScreen tip="Loading..." />;
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-primary-600 mb-6 text-center text-3xl font-bold">Welcome</h1>
        <p className="mb-8 text-center text-gray-600">Sign in to continue to HaiVuiLam</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              Back to Home
            </Button>
          </Link>
          <LoginButton />
        </div>
      </div>
    </AuthLayout>
  );
}
