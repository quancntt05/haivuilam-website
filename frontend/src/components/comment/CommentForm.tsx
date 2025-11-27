'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import {
  VALIDATION_RULES,
  validateCommentContent,
  sanitizeCommentContent,
} from '@/lib/utils/validation';

const { TextArea } = Input;

interface CommentFormProps {
  photoId: string;
  onSuccess?: () => void;
}

export default function CommentForm({ photoId, onSuccess }: CommentFormProps) {
  const { createComment, loading } = useComments();
  const { isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (values: { content: string }) => {
    if (!isAuthenticated) {
      message.error('Please login to comment');
      return;
    }

    const sanitizedContent = sanitizeCommentContent(values.content);
    const validation = validateCommentContent(sanitizedContent);

    if (!validation.isValid) {
      message.error(validation.error);
      return;
    }

    try {
      await createComment({ photoId, content: sanitizedContent });
      message.success('Comment added successfully');
      form.resetFields();
      setCharCount(0);
      onSuccess?.();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to add comment');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Form form={form} onFinish={handleSubmit} className="mt-4">
      <Form.Item
        name="content"
        rules={[
          { required: true, message: 'Please enter a comment' },
          {
            min: VALIDATION_RULES.COMMENT.MIN_LENGTH,
            message: `Comment must be at least ${VALIDATION_RULES.COMMENT.MIN_LENGTH} character`,
          },
          {
            max: VALIDATION_RULES.COMMENT.MAX_LENGTH,
            message: `Comment must not exceed ${VALIDATION_RULES.COMMENT.MAX_LENGTH} characters`,
          },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Write a comment..."
          maxLength={VALIDATION_RULES.COMMENT.MAX_LENGTH}
          showCount
          onChange={e => setCharCount(e.target.value.length)}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SendOutlined />}
          loading={loading}
          disabled={charCount === 0}
        >
          Send Comment
        </Button>
      </Form.Item>
    </Form>
  );
}
