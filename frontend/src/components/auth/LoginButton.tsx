'use client';

import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

export default function LoginButton() {
  const { login, isLoading } = useAuth();

  return (
    <Button
      type="primary"
      icon={<GoogleOutlined />}
      size="large"
      onClick={login}
      loading={isLoading}
    >
      Sign in with Google
    </Button>
  );
}

