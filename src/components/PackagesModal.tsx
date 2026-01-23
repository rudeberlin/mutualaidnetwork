import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import type { Package } from '../types';

interface PackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  onSelect: (pkg: Package) => void;
}

export const PackagesModal: React.FC<PackagesModalProps> = ({ isOpen, onClose, packages, onSelect }) => {
  const [packageImages, setPackageImages] = useState<{ [key: string]: string | undefined }>({});

  if (!isOpen) return null;

  const handleImageUpload = (packageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPackageImages(prev => ({ ...prev, [packageId]: imageData }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700/30 bg-slate-900/80 backdrop-blur">
          <h2 className="text-2xl font-bold text-white">Choose Your Package</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <X className="text-slate-400 hover:text-white" size={24} />
          </button>
        </div>

        {/* Packages Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const displayImage = packageImages[pkg.id] || pkg.image;
            return (
              <div
                key={pkg.id}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
              >
                {/* Package Image with Upload */}
                <div className="relative mb-4 group">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={pkg.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-slate-700/50 rounded-lg flex items-center justify-center text-4xl">
                      {pkg.icon}
                    </div>
                  )}
                  <label className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 flex items-center justify-center cursor-pointer transition-all">
                    <Upload className="text-white/0 group-hover:text-white w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(pkg.id, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Title & Amount */}
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-emerald-500 mb-3">
                  ${pkg.amount.toLocaleString()}
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-6">{pkg.description}</p>

                {/* Select Button */}
                <button
                  onClick={() => {
                    onSelect(pkg);
                    onClose();
                  }}
                  className="w-full px-4 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all"
                >
                  Select Package
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
