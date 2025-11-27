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
    <div className="flex min-h-screen flex-col">
      <Layout className="flex min-h-screen flex-col">
        <Header />
        <Content className="flex-1 bg-gray-50">{children}</Content>
        <Footer />
      </Layout>
    </div>
  );
}
