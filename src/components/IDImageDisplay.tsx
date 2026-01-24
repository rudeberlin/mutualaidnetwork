import React, { useState } from 'react';
import { ImageOff, Download } from 'lucide-react';

interface IDImageDisplayProps {
  imagePath: string | null;
  alt: string;
  userName: string;
  size?: 'small' | 'medium' | 'large';
  onDownload?: () => void;
  className?: string;
}

export const IDImageDisplay: React.FC<IDImageDisplayProps> = ({
  imagePath,
  alt,
  userName,
  size = 'medium',
  onDownload,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    small: 'w-24 h-32',
    medium: 'w-40 h-56',
    large: 'w-64 h-96',
  };

  if (!imagePath || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <ImageOff className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className={`${sizeClasses[size]} bg-slate-800 rounded-lg border border-slate-600 overflow-hidden relative`}>
        {isLoading && (
          <div className="absolute inset-0 bg-slate-700 animate-pulse flex items-center justify-center">
            <div className="text-xs text-slate-400">Loading...</div>
          </div>
        )}
        <img
          src={imagePath}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImageError(true);
          }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 rounded-lg bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={onDownload}
          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-200">{alt}</span>
      </div>

      {/* Image Info */}
      <p className="text-xs text-slate-400 mt-2 text-center truncate">{userName}</p>
    </div>
  );
};
