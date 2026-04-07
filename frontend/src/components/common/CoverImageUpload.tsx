import React, { useState, useRef } from 'react';
import supabase from '../../config/supabase';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

interface CoverImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  className?: string;
}

export default function CoverImageUpload({ currentImageUrl, onUploadSuccess, className = '' }: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 5MB.');
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp hình ảnh.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `story-covers/${fileName}`;

      // Xóa ảnh cũ nếu có (tránh rác hệ thống)
      if (currentImageUrl) {
        // Trích xuất path từ URL (VD: covers/story-covers/abc.jpg -> story-covers/abc.jpg)
        const pathPart = currentImageUrl.split('/covers/').pop();
        if (pathPart) {
          // Bỏ qua lỗi xóa ảnh cũ để không block luồng upload
          await supabase.storage.from('covers').remove([pathPart]).catch(e => console.warn('Không thể xóa ảnh cũ:', e));
        }
      }

      // Upload the file to Supabase Storage in the 'covers' bucket
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      setSuccess(true);
      onUploadSuccess(publicUrl);
    } catch (err: any) {
      console.error('Lỗi khi tải ảnh lên:', err);
      setError(err.message || 'Đã có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Just simulate assigning the files to the input and triggering a change event
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        handleFileChange({ target: { files: e.dataTransfer.files } } as any);
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative w-full aspect-[3/4] max-w-[200px] border-2 border-dashed rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-all ${
          isUploading ? 'border-violet-500 bg-violet-500/10' : 
          error ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20' : 
          success ? 'border-green-500 bg-green-500/10' : 
          'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-violet-500'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center p-4 text-center">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-violet-400 font-medium">Đang tải lên...</p>
          </div>
        ) : currentImageUrl ? (
          <>
            <img src={currentImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center text-white">
                <UploadCloud size={24} className="mb-2" />
                <span className="text-sm font-medium">Đổi ảnh bìa</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center p-4 text-center">
            {error ? (
              <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
            ) : success ? (
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            )}
            
            <p className="text-sm font-medium text-slate-300">Tải ảnh bìa</p>
            <p className="text-[10px] text-slate-500 mt-1">JPEG, PNG, WEBP (Tối đa 5MB)</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
