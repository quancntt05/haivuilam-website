'use client';

import { Spin } from 'antd';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({
  size = 'large',
  tip = 'Loading...',
  fullScreen = false,
  className = '',
}: LoadingProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClass} ${className}`}>
      <Spin size={size} tip={tip} />
    </div>
  );
}

