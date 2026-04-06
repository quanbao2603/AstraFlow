import React, { useRef, useState } from 'react';
import { Upload, Download, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { parseStoryTxt, generateTemplateContent } from '../../../../core/utils/storyTxtParser';
import type { StoryFormData } from '../../types/studio';

interface TxtUploadButtonProps {
  onImport: (data: Partial<StoryFormData>) => void;
}

interface ImportStatus {
  type: 'success' | 'warning' | 'error';
  message: string;
  warnings?: string[];
}

export default function TxtUploadButton({ onImport }: TxtUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      setStatus({ type: 'error', message: 'Chỉ hỗ trợ file .txt!' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { data, warnings } = parseStoryTxt(content);

        const filledFields = Object.values(data).filter(v =>
          v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
        ).length;

        if (filledFields === 0) {
          setStatus({ type: 'error', message: 'Không tìm thấy dữ liệu hợp lệ trong file. Kiểm tra lại định dạng.' });
          return;
        }

        onImport(data);

        if (warnings.length > 0) {
          setStatus({
            type: 'warning',
            message: `Đã điền ${filledFields} trường dữ liệu. Có ${warnings.length} cảnh báo:`,
            warnings,
          });
        } else {
          setStatus({
            type: 'success',
            message: `Đã tự điền thành công ${filledFields} trường từ file "${file.name}"!`,
          });
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Lỗi đọc file. Kiểm tra lại định dạng.' });
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input để có thể upload lại cùng file
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDownloadTemplate = () => {
    const content = generateTemplateContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'astraflow-story-template.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColors = {
    success: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    warning: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
    error: 'border-red-500/30 bg-red-500/5 text-red-400',
  };

  const StatusIcon = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle,
  };

  return (
    <div className="mb-8">
      {/* Drop zone + buttons */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-5 transition-all duration-300
          ${isDragging
            ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
          }
        `}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
            <FileText size={22} />
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-slate-200">
              Import ý tưởng từ file <span className="text-violet-400">.txt</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Kéo thả file vào đây hoặc click "Chọn File" — tự điền toàn bộ form
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded-xl transition-colors font-medium"
            >
              <Download size={13} /> Template
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-xl transition-colors font-semibold shadow-lg shadow-violet-500/20"
            >
              <Upload size={13} /> Chọn File
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Status message */}
      {status && (
        <div className={`mt-3 p-3 border rounded-xl flex gap-3 items-start ${statusColors[status.type]}`}>
          {React.createElement(StatusIcon[status.type], { size: 16, className: 'flex-shrink-0 mt-0.5' })}
          <div className="flex-1 text-xs">
            <p className="font-medium">{status.message}</p>
            {status.warnings && status.warnings.length > 0 && (
              <ul className="mt-1.5 space-y-0.5 text-amber-300/80">
                {status.warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => setStatus(null)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
