export interface PhotoUploadFormData {
  photo: File;
}

export interface CommentFormData {
  photoId: string;
  content: string;
}

export interface CommentEditFormData {
  content: string;
}
