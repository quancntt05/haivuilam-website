'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import PhotoGrid from '@/components/photo/PhotoGrid';
import { usePhotos } from '@/hooks/usePhotos';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/common/Loading';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function HomePage() {
  const { photos, pagination, loading, error, fetchPhotos } = usePhotos();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPhotos({ page, limit: 20 });
  }, [page, fetchPhotos]);

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const hasMore = pagination.page < pagination.totalPages;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Photos</h1>
          {isAuthenticated && (
            <Button
              type="primary"
              icon={<UploadOutlined />}
              size="large"
              onClick={() => router.push('/upload')}
            >
              Upload Photo
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            <p>Error: {error.message}</p>
          </div>
        )}

        <PhotoGrid
          photos={photos}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </MainLayout>
  );
}
