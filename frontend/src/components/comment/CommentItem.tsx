'use client';

import { useState } from 'react';
import { Card, Avatar, Space, Typography, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Comment } from '@/types/comment.types';
import { formatDistanceToNow } from 'date-fns';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';

const { Text } = Typography;
const { TextArea } = Input;
const MAX_LENGTH = 1000;

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const { updateComment, deleteComment, loading } = useComments();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();

  const isOwner = user?.id === comment.userId;

  const handleEdit = async (values: { content: string }) => {
    try {
      await updateComment(comment.id, { content: values.content });
      message.success('Comment updated successfully');
      setIsEditing(false);
      form.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update comment');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      message.success('Comment deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to delete comment');
    }
  };

  if (isEditing) {
    return (
      <Card className="mb-4">
        <Form form={form} initialValues={{ content: comment.content }} onFinish={handleEdit}>
          <Form.Item
            name="content"
            rules={[
              { required: true, message: 'Please enter a comment' },
              { min: 1, message: 'Comment must be at least 1 character' },
              { max: MAX_LENGTH, message: `Comment must not exceed ${MAX_LENGTH} characters` },
            ]}
          >
            <TextArea rows={3} maxLength={MAX_LENGTH} showCount />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-start justify-between">
          <Space className="flex-1">
            <Avatar src={comment.user?.image} icon={<UserOutlined />} />
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Text strong>{comment.user?.name || comment.user?.email}</Text>
                <Text type="secondary" className="text-xs">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Text>
              </div>
              <Text>{comment.content}</Text>
            </div>
          </Space>
          {isOwner && (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setIsEditing(true);
                  form.setFieldsValue({ content: comment.content });
                }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => setIsDeleteModalOpen(true)}
              />
            </Space>
          )}
        </div>
      </Card>

      <Modal
        title="Delete Comment"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
      </Modal>
    </>
  );
}
