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
    <Layout className="min-h-screen">
      <Header />
      <Content className="flex-1">{children}</Content>
      <Footer />
    </Layout>
  );
}

