import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface IDUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onImageLoaded?: (data: string) => void;
  preview?: boolean;
}

export const IDUploadField = ({
  label,
  value,
  onChange,
  onImageLoaded,
  preview = true,
}: IDUploadFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileConversion = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onChange(base64String);
      onImageLoaded?.(base64String);
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileConversion(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileConversion(file);
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-gold-400 bg-gold-500/10'
              : 'border-gray-600 hover:border-gold-400/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="space-y-2"
          >
            <Upload className="w-8 h-8 text-gold-400 mx-auto" />
            <p className="text-gray-300 text-sm">
              Drag and drop or <span className="text-gold-400 font-semibold">click to upload</span>
            </p>
            <p className="text-gray-500 text-xs">PNG, JPG, or GIF (max 5MB)</p>
          </div>

          {isLoading && <p className="text-gold-400 text-sm mt-2">Processing image...</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {preview && (
            <div className="relative rounded-lg overflow-hidden bg-dark-800 p-3">
              <img
                src={value}
                alt={label}
                className="w-full h-40 object-cover rounded blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 rounded" />
              <p className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                Image stored (blurred)
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear & Re-upload
          </button>
        </div>
      )}
    </div>
  );
};
