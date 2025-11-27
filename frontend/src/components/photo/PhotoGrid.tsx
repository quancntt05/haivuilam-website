'use client';

import { Row, Col, Empty, Button } from 'antd';
import PhotoCard from './PhotoCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Photo } from '@/types/photo.types';

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
  error?: Error | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRetry?: () => void;
}

export default function PhotoGrid({
  photos,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRetry,
}: PhotoGridProps) {
  if (loading && photos.length === 0) {
    return <SkeletonLoader type="page" tip="Loading photos..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <ErrorDisplay error={error} onRetry={onRetry} className="w-full max-w-2xl" />
      </div>
    );
  }

  if (!loading && photos.length === 0) {
    return (
      <Empty description="No photos yet" image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-12" />
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col">
      <Row gutter={[16, 16]} className="flex-1">
        {photos.map(photo => (
          <Col key={photo.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <PhotoCard photo={photo} />
          </Col>
        ))}
      </Row>
      {hasMore && (
        <div className="mt-8 text-center">
          <Button type="primary" loading={loading} onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
