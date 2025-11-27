import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import '../styles/globals.css';
import AuthProvider from '@/providers/AuthProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HaiVuiLam Photo Sharing App',
  description: 'Share and comment on photos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ConfigProvider>
            <AuthProvider>{children}</AuthProvider>
          </ConfigProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
