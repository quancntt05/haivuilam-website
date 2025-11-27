'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import PhotoUpload from '@/components/photo/PhotoUpload';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/common/Loading';

export default function UploadPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <Loading fullScreen tip="Loading..." />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <PhotoUpload />
      </div>
    </MainLayout>
  );
}

