export const VALIDATION_RULES = {
  PHOTO: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
} as const;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePhotoFile = (file: File): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (
    !VALIDATION_RULES.PHOTO.ALLOWED_TYPES.includes(
      file.type as (typeof VALIDATION_RULES.PHOTO.ALLOWED_TYPES)[number]
    )
  ) {
    return {
      isValid: false,
      error: `Invalid file type. Only ${VALIDATION_RULES.PHOTO.ALLOWED_TYPES.join(', ')} are allowed.`,
    };
  }

  if (file.size > VALIDATION_RULES.PHOTO.MAX_SIZE) {
    const maxSizeMB = VALIDATION_RULES.PHOTO.MAX_SIZE / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds the limit of ${maxSizeMB}MB.`,
    };
  }

  return { isValid: true };
};

export const validateCommentContent = (content: string): ValidationResult => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Comment content is required' };
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length < VALIDATION_RULES.COMMENT.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Comment must be at least ${VALIDATION_RULES.COMMENT.MIN_LENGTH} character long`,
    };
  }

  if (trimmedContent.length > VALIDATION_RULES.COMMENT.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Comment must not exceed ${VALIDATION_RULES.COMMENT.MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
};

export const sanitizeCommentContent = (content: string): string => {
  return content.trim().replace(/\s+/g, ' ');
};
