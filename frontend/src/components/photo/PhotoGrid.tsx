'use client';

import { Row, Col, Empty, Button } from 'antd';
import PhotoCard from './PhotoCard';
import Loading from '@/components/common/Loading';
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
    return <SkeletonLoader count={8} type="photo" />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} className="mb-4" />;
  }

  if (!loading && photos.length === 0) {
    return (
      <Empty
        description="No photos yet"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="py-12"
      />
    );
  }

  return (
    <div className="w-full">
      <Row gutter={[16, 16]}>
        {photos.map(photo => (
          <Col key={photo.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <PhotoCard photo={photo} />
          </Col>
        ))}
      </Row>
      {hasMore && (
        <div className="text-center mt-8">
          <Button type="primary" loading={loading} onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

