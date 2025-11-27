'use client';

import { useEffect } from 'react';
import { Empty, Spin } from 'antd';
import { useComments } from '@/hooks/useComments';
import CommentItem from './CommentItem';
import Loading from '@/components/common/Loading';

interface CommentListProps {
  photoId: string;
}

export default function CommentList({ photoId }: CommentListProps) {
  const { comments, loading, error, fetchComments } = useComments();

  useEffect(() => {
    fetchComments(photoId);
  }, [photoId, fetchComments]);

  if (loading && comments.length === 0) {
    return <Loading tip="Loading comments..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Failed to load comments: {error.message}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <Empty
        description="No comments yet. Be the first to comment!"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="py-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

