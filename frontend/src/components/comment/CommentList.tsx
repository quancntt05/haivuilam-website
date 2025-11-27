'use client';

import { useEffect } from 'react';
import { Empty } from 'antd';
import { useComments } from '@/hooks/useComments';
import CommentItem from './CommentItem';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import ErrorDisplay from '@/components/common/ErrorDisplay';

interface CommentListProps {
  photoId: string;
}

export default function CommentList({ photoId }: CommentListProps) {
  const { comments, loading, error, fetchComments } = useComments();

  useEffect(() => {
    fetchComments(photoId);
  }, [photoId, fetchComments]);

  if (loading && comments.length === 0) {
    return <SkeletonLoader count={3} type="comment" />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => fetchComments(photoId)}
        className="mb-4"
      />
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

