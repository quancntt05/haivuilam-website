'use client';

import { useEffect } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import MainLayout from '@/layouts/MainLayout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={[
            <Button type="primary" key="home" icon={<HomeOutlined />} href="/">
              Back Home
            </Button>,
            <Button key="retry" icon={<ReloadOutlined />} onClick={reset}>
              Try Again
            </Button>,
          ]}
        />
      </div>
    </MainLayout>
  );
}

