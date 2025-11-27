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
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full`} suppressHydrationWarning>
        <div id="root" className="h-full">
          <ErrorBoundary>
            <ConfigProvider>
              <AuthProvider>{children}</AuthProvider>
            </ConfigProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
