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
    const { file } = info;

    if (file.status === 'removed') {
      setFileList([]);
      setPreview(null);
      return;
    }

    if (file.originFileObj) {
      const validation = validatePhotoFile(file.originFileObj);
      if (!validation.isValid) {
        message.error(validation.error);
        setFileList([]);
        setPreview(null);
        return;
      }

      setFileList([file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file.originFileObj);
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
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Photo</h2>

      <Upload
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        accept="image/jpeg,image/png,image/webp"
        maxCount={1}
        listType="picture-card"
        className="w-full"
      >
        {fileList.length === 0 && (
          <div>
            <UploadOutlined className="text-2xl" />
            <div className="mt-2">Click or drag to upload</div>
          </div>
        )}
      </Upload>

      {preview && (
        <div className="mt-4 relative">
          <Image src={preview} alt="Preview" className="w-full rounded" />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={handleRemove}
            className="mt-2"
          >
            Remove
          </Button>
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
        <p>Allowed formats: {VALIDATION_RULES.PHOTO.ALLOWED_TYPES.join(', ').replace('image/', '').toUpperCase()}</p>
        <p>Max file size: {VALIDATION_RULES.PHOTO.MAX_SIZE / (1024 * 1024)}MB</p>
      </div>
    </div>
  );
}

