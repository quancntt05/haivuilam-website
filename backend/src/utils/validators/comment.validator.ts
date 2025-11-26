const MIN_COMMENT_LENGTH = 1;
const MAX_COMMENT_LENGTH = 1000;

export const validateCommentContent = (
  content: string
): {
  isValid: boolean;
  error?: string;
} => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Comment content is required' };
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length < MIN_COMMENT_LENGTH) {
    return {
      isValid: false,
      error: `Comment must be at least ${MIN_COMMENT_LENGTH} character long`,
    };
  }

  if (trimmedContent.length > MAX_COMMENT_LENGTH) {
    return {
      isValid: false,
      error: `Comment must not exceed ${MAX_COMMENT_LENGTH} characters`,
    };
  }

  return { isValid: true };
};

export const sanitizeCommentContent = (content: string): string => {
  return content.trim().replace(/\s+/g, ' ');
};

export const validateCommentCreation = (data: {
  photoId: string;
  content: string;
}): {
  isValid: boolean;
  error?: string;
} => {
  if (!data.photoId || typeof data.photoId !== 'string') {
    return { isValid: false, error: 'Photo ID is required' };
  }

  const contentValidation = validateCommentContent(data.content);
  if (!contentValidation.isValid) {
    return contentValidation;
  }

  return { isValid: true };
};
