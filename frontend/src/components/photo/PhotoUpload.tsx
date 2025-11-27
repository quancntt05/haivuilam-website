'use client';

import { useState, useCallback } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { usePhotos } from '@/hooks/usePhotos';
import { useAuth } from '@/hooks/useAuth';
import { VALIDATION_RULES, validatePhotoFile } from '@/lib/utils/validation';

export default function PhotoUpload() {
  const { uploadPhoto, loading } = usePhotos();
  const { isAuthenticated } = useAuth();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange: UploadProps['onChange'] = info => {
    const file = info.fileList[0];

    if (file.originFileObj) {
      const validation = validatePhotoFile(file.originFileObj as File);
      if (!validation.isValid) {
        message.error(validation.error);
        setFileList([]);
        setPreview(null);
        return;
      }

      const fileWithStatus: UploadFile = {
        ...file,
        status: 'done',
        uid: file.uid || `-${Date.now()}`,
      };

      setFileList([fileWithStatus]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.onerror = () => {
        message.error('Failed to load image preview');
      };
      reader.readAsDataURL(file.originFileObj);

      message.success('File selected successfully');
    }
  };

  const handleUpload = useCallback(async () => {
    if (!isAuthenticated) {
      message.error('Please login to upload photos');
      return;
    }

    const file = fileList[0]?.originFileObj;
    if (!file) {
      message.error('Please select a file');
      return;
    }

    try {
      await uploadPhoto(file);
      message.success('Photo uploaded successfully');
      setFileList([]);
      setPreview(null);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Upload failed');
    }
  }, [fileList, uploadPhoto, isAuthenticated]);

  const handleRemove = () => {
    setFileList([]);
    setPreview(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Upload Photo</h2>

      <Upload
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        accept="image/jpeg,image/png,image/webp"
        maxCount={1}
        listType="picture-card"
        className="w-full"
        onRemove={handleRemove}
      >
        {fileList.length === 0 && (
          <div>
            <UploadOutlined className="text-2xl" />
            <div className="mt-2">Click or drag to upload</div>
          </div>
        )}
      </Upload>

      {preview && fileList.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-gray-700">Preview:</div>
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              className="w-full rounded border border-gray-200"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      <Button
        type="primary"
        size="large"
        onClick={handleUpload}
        loading={loading}
        disabled={fileList.length === 0}
        className="mt-4 w-full"
      >
        Upload Photo
      </Button>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          Allowed formats:{' '}
          {VALIDATION_RULES.PHOTO.ALLOWED_TYPES.join(', ').replace('image/', '').toUpperCase()}
        </p>
        <p>Max file size: {VALIDATION_RULES.PHOTO.MAX_SIZE / (1024 * 1024)}MB</p>
      </div>
    </div>
  );
}
