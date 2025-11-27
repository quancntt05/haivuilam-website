'use client';

import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter className="text-center bg-gray-50 border-t">
      <p className="m-0 text-gray-600">
        © {new Date().getFullYear()} HaiVuiLam Photo Sharing App. All rights reserved.
      </p>
    </AntFooter>
  );
}

