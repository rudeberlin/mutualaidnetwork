import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30' : 
                  type === 'error' ? 'bg-red-500/15 border-red-500/30' : 
                  'bg-blue-500/15 border-blue-500/30';
  
  const textColor = type === 'success' ? 'text-emerald-200' : 
                    type === 'error' ? 'text-red-200' : 
                    'text-blue-200';
  
  const IconComponent = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : null;

  return (
    <div className={`fixed top-4 right-4 flex items-start gap-3 p-4 ${bgColor} border rounded-lg z-[9999] max-w-sm animate-in fade-in slide-in-from-top duration-200`}>
      {IconComponent && <IconComponent className={`w-5 h-5 ${type === 'success' ? 'text-emerald-400' : 'text-red-400'} flex-shrink-0 mt-0.5`} />}
      <p className={`text-sm ${textColor}`}>{message}</p>
      <button 
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-auto flex-shrink-0 p-1 hover:bg-white/10 rounded transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
