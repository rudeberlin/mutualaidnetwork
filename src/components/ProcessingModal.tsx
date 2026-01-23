import React, { useState } from 'react';
import { CheckCircle, Upload } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  title: string;
  status: 'processing' | 'pending' | 'matched' | null;
  matchedHelper?: string;
  helperImage?: string;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  title,
  status,
  matchedHelper,
  helperImage: initialHelperImage,
}) => {
  const [helperImage, setHelperImage] = useState<string | undefined>(initialHelperImage);

  if (!isOpen || !status) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setHelperImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 border-r-emerald-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 mb-6">Finding the best match for you...</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-yellow-500 border-r-yellow-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request Pending</h3>
            <p className="text-slate-400 mb-6">Your request is being reviewed by our admin. This typically takes 1-2 hours.</p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">You can check your dashboard to see the status anytime.</p>
            </div>
          </>
        )}

        {status === 'matched' && (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Match Found!</h3>
            <p className="text-slate-400 mb-4">You've been matched with a helper!</p>
            
            {/* Helper Profile Image with Upload */}
            <div className="relative mb-6 group">
              {helperImage ? (
                <img
                  src={helperImage}
                  alt="Helper"
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-emerald-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto bg-slate-700/50 flex items-center justify-center border-2 border-emerald-500">
                  <span className="text-2xl">👤</span>
                </div>
              )}
              <label className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100">
                <Upload className="text-white w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                  onClick={(e) => e.stopPropagation()}
                />
              </label>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
              <p className="text-emerald-300 text-sm font-semibold">{matchedHelper}</p>
              <p className="text-slate-400 text-xs mt-1">Check your messages to connect</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
