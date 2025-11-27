import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '@/providers/AuthProvider';
import { ConfigProvider } from 'antd';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HaiVuiLam Photo Sharing App',
  description: 'Share and comment on photos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
