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
  if (fullScreen) {
    return (
      <div
        className={`bg-opacity-75 fixed inset-0 z-50 flex flex-col items-center justify-center bg-white ${className}`}
      >
        <Spin size={size} />
        {tip && <p className="mt-4 text-gray-600">{tip}</p>}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Spin size={size} />
      {tip && <span className="ml-3 text-gray-600">{tip}</span>}
    </div>
  );
}
