'use client';

import { Layout, Avatar, Dropdown, Button, Space } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => router.push('/'),
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

  return (
    <AntHeader className="bg-white shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary-600 m-0">HaiVuiLam</h1>
        {isAuthenticated && (
          <Space>
            {navItems.map(item => (
              <Button
                key={item.key}
                type="text"
                icon={item.icon}
                onClick={item.onClick}
                className="flex items-center"
              >
                {item.label}
              </Button>
            ))}
          </Space>
        )}
      </div>

      {isAuthenticated && user ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="cursor-pointer">
            <Avatar src={user.image} icon={<UserOutlined />} />
            <span className="hidden md:inline">{user.name || user.email}</span>
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

