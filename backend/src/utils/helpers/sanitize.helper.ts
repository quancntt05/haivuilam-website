export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '').replace(/\s+/g, ' ');
};

/**
 * Sanitize comment input to prevent XSS attacks and remove HTML tags
 */
export const sanitizeComment = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/\.\./g, '')
    .substring(0, 255);
};
