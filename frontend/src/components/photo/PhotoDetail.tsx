'use client';

import { useState } from 'react';
import { Card, Avatar, Space, Typography, Button, Modal, message } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { PhotoDetail as PhotoDetailType } from '@/types/photo.types';
import { formatDistanceToNow } from 'date-fns';
import { usePhotos } from '@/hooks/usePhotos';
import { useAuth } from '@/hooks/useAuth';
import CommentList from '@/components/comment/CommentList';
import CommentForm from '@/components/comment/CommentForm';
import Loading from '@/components/common/Loading';

const { Text, Title } = Typography;

interface PhotoDetailProps {
  photo: PhotoDetailType;
}

export default function PhotoDetail({ photo }: PhotoDetailProps) {
  const { deletePhoto, loading } = usePhotos();
  const { user } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isOwner = user?.id === photo.userId;

  const handleDelete = async () => {
    try {
      await deletePhoto(photo.id);
      message.success('Photo deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to delete photo');
    }
  };

  const imageUrl = photo.url.startsWith('http')
    ? photo.url
    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${photo.url}`;

  if (loading) {
    return <Loading tip="Loading..." />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <div className="mb-4 flex justify-between items-start">
          <Space>
            <Avatar src={photo.user?.image} icon={<UserOutlined />} />
            <div>
              <Text strong>{photo.user?.name || photo.user?.email}</Text>
              <br />
              <Text type="secondary" className="text-xs">
                {formatDistanceToNow(new Date(photo.createdAt), { addSuffix: true })}
              </Text>
            </div>
          </Space>
          {isOwner && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          )}
        </div>

        <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={photo.originalName}
            width={800}
            height={800}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        <div className="mb-6">
          <Title level={5}>Comments</Title>
          <CommentList photoId={photo.id} />
          <CommentForm photoId={photo.id} />
        </div>
      </Card>

      <Modal
        title="Delete Photo"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete this photo? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

