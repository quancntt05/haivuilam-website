'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import PhotoGrid from '@/components/photo/PhotoGrid';
import { usePhotos } from '@/hooks/usePhotos';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/common/Loading';
import { Avatar, Card, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { photos, pagination, loading, fetchPhotos, getUserPhotos } = usePhotos();
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user?.id) {
      getUserPhotos(user.id, { page, limit: 20 });
    }
  }, [user?.id, page, getUserPhotos]);

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const hasMore = pagination.page < pagination.totalPages;

  if (authLoading || !isAuthenticated) {
    return <Loading fullScreen tip="Loading..." />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <Space size="large" className="w-full">
            <Avatar size={80} src={user?.image} icon={<UserOutlined />} />
            <div>
              <Title level={2} className="m-0">
                {user?.name || user?.email}
              </Title>
              <Text type="secondary">{user?.email}</Text>
              <div className="mt-2">
                <Text strong>{photos.length}</Text> <Text type="secondary">photos</Text>
              </div>
            </div>
          </Space>
        </Card>

        <Title level={3}>My Photos</Title>
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

