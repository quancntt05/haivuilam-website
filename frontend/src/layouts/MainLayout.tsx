'use client';

import { Layout } from 'antd';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ReactNode } from 'react';

const { Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Layout className="flex min-h-screen flex-col">
      <Header />
      <Content className="flex min-h-0 flex-1 flex-col bg-gray-50">{children}</Content>
      <Footer />
    </Layout>
  );
}
