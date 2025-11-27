'use client';

import { useState, useEffect } from 'react';
import Loading from '@/components/common/Loading';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading fullScreen tip="Loading..." />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">HaiVuiLam Photo Sharing App</h1>
      <p className="mt-4 text-gray-600">Welcome to the photo sharing application</p>
    </main>
  );
}
