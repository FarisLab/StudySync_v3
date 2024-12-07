'use client';

import React, { useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';


interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

const DocumentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, UploadingFile>>({});
  const supabase = createClientComponentClient();

  const uploadFile = async (file: File) => {
    const fileId = uuidv4();
    setUploadingFiles(prev => ({
      ...prev,
      [fileId]: { file, progress: 0 }
    }));

    try {
      // Create a unique file path with UUID as first segment
      const fileId = uuidv4();
      const fileExt = file.name.split('.').pop();
      const fileName = `${fileId}/${file.name}`;
      const filePath = fileName;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get user information
      const { data: { user } } = await supabase.auth.getUser();

      // Insert file record in the database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
          user_id: user?.id
        });

      if (dbError) throw dbError;

      // Update progress to complete
      setUploadingFiles(prev => ({
        ...prev,
        [fileId]: { ...prev[fileId], progress: 100 }
      }));

      // Remove from uploading list after a delay
      setTimeout(() => {
        setUploadingFiles(prev => {
          const newState = { ...prev };
          delete newState[fileId];
          return newState;
        });
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadingFiles(prev => ({
        ...prev,
        [fileId]: { ...prev[fileId], error: error.message }
      }));
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
  }, []);

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-white/10 hover:border-white/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-white/60">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm">
            Drag and drop your files here, or{' '}
            <span className="text-purple-400">browse</span>
          </p>
          <p className="text-xs mt-2">Supported files: PDF, DOC, DOCX, TXT</p>
        </div>
      </div>

      {/* Upload Progress */}
      <div className="mt-4 space-y-2">
        {Object.entries(uploadingFiles).map(([id, { file, progress, error }]) => (
          <div
            key={id}
            className={`bg-white/5 rounded-lg p-3 flex items-center justify-between ${
              error ? 'border border-red-500/50' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg
                className="h-5 w-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.name}</p>
                {error ? (
                  <p className="text-xs text-red-400">{error}</p>
                ) : (
                  <p className="text-xs text-white/40">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              {error ? (
                <span className="text-xs text-red-400">Failed</span>
              ) : progress === 100 ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <div className="w-12 bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUpload;
