'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import PhotoDetail from '@/components/photo/PhotoDetail';
import { usePhotos } from '@/hooks/usePhotos';
import Loading from '@/components/common/Loading';
import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export default function PhotoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { photo, loading, error, getPhotoById } = usePhotos();

  useEffect(() => {
    if (id) {
      getPhotoById(id);
    }
  }, [id, getPhotoById]);

  if (loading) {
    return (
      <MainLayout>
        <Loading fullScreen tip="Loading photo..." />
      </MainLayout>
    );
  }

  if (error || !photo) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Result
            status="404"
            title="404"
            subTitle="Photo not found"
            extra={
              <Button type="primary" icon={<HomeOutlined />} onClick={() => router.push('/')}>
                Back to Home
              </Button>
            }
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <PhotoDetail photo={photo} />
      </div>
    </MainLayout>
  );
}

