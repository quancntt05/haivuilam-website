'use client';

import { Layout, Avatar, Dropdown, Button, Space, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => router.push('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const navItems = [
    {
      key: 'home',
      label: 'Home',
      icon: <HomeOutlined />,
      onClick: () => router.push('/'),
    },
    {
      key: 'upload',
      label: 'Upload',
      icon: <UploadOutlined />,
      onClick: () => router.push('/upload'),
    },
  ];

  const selectedKey = useMemo(() => {
    if (pathname === '/upload') {
      return 'upload';
    }
    return 'home';
  }, [pathname]);

  return (
    <AntHeader className="flex items-center justify-between px-6 shadow-sm">
      <div className="flex w-full items-center gap-4">
        <h1 className="text-primary-600 m-0 text-xl font-bold">HaiVuiLam</h1>
        {isAuthenticated && (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={navItems}
            style={{ flex: 1, minWidth: 0, borderBottom: 'none', background: 'transparent' }}
          />
        )}
      </div>

      {isAuthenticated && user ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="w-3xs cursor-pointer">
            <Avatar src={user.image} icon={<UserOutlined />} />
            <span className="text-white">{user.name || user.email}</span>
          </Space>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={() => router.push('/login')}>
          Login
        </Button>
      )}
    </AntHeader>
  );
}
