'use client';

import { Skeleton, Card, Spin } from 'antd';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'photo' | 'comment' | 'profile' | 'page';
  tip?: string;
}

export default function SkeletonLoader({ count = 4, type = 'photo', tip }: SkeletonLoaderProps) {
  if (type === 'page') {
    return (
      <div className="bg-opacity-75 absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <Spin size="large" />
        {tip && <p className="mt-4 text-gray-600">{tip}</p>}
      </div>
    );
  }

  if (type === 'photo') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} loading={true}>
            <Skeleton.Image active className="!h-64 !w-full" />
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
