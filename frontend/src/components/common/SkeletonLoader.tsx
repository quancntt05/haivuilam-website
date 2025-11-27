'use client';

import { Skeleton, Card } from 'antd';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'photo' | 'comment' | 'profile';
}

export default function SkeletonLoader({ count = 4, type = 'photo' }: SkeletonLoaderProps) {
  if (type === 'photo') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} loading={true}>
            <Skeleton.Image active className="!w-full !h-64" />
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'comment') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index}>
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <Card>
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  return null;
}

