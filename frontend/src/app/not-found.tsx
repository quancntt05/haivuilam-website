import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import MainLayout from '@/layouts/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link href="/">
              <Button type="primary" icon={<HomeOutlined />}>
                Back Home
              </Button>
            </Link>
          }
        />
      </div>
    </MainLayout>
  );
}

