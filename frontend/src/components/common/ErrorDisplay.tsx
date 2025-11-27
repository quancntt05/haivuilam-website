'use client';

import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorDisplay({ error, onRetry, className }: ErrorDisplayProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Alert
      title="Error"
      description={errorMessage}
      type="error"
      showIcon
      action={
        onRetry && (
          <Button size="small" danger icon={<ReloadOutlined />} onClick={onRetry}>
            Retry
          </Button>
        )
      }
      className={className}
    />
  );
}
