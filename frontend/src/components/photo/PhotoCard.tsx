'use client';

import { Card, Avatar, Space, Typography } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { Photo } from '@/types/photo.types';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/photos/${photo.id}`);
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    const parts = cleanUrl.split('/');
    const filename = parts[parts.length - 1] || '';
    return `/api/images/${filename}`;
  };

  const imageUrl = getImageUrl(photo.url);

  return (
    <Card
      hoverable
      className="w-full"
      cover={
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={photo.originalName}
            fill
            className="cursor-pointer object-cover"
            onClick={handleClick}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      }
    >
      <Card.Meta
        avatar={
          <Avatar
            src={photo.user?.image}
            icon={<UserOutlined />}
            alt={photo.user?.name || 'User'}
          />
        }
        title={
          <Space>
            <Text strong>{photo.user?.name || photo.user?.email}</Text>
            <Text type="secondary" className="text-xs">
              {formatDistanceToNow(new Date(photo.createdAt), { addSuffix: true })}
            </Text>
          </Space>
        }
        description={
          <Space>
            <MessageOutlined />
            <Text type="secondary">{photo._count?.comments || 0} comments</Text>
          </Space>
        }
      />
    </Card>
  );
}
