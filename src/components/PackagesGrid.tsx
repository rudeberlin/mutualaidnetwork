import React, { useState } from 'react';
import type { Package } from '../types';
import { Check, TrendingUp, Upload } from 'lucide-react';

interface PackageCardProps {
  pkg: Package;
  onSelect: (pkg: Package) => void;
  isSelected?: boolean;
}

export const PackageCardComponent: React.FC<PackageCardProps> = ({
  pkg,
  onSelect,
  isSelected,
}) => {
  const [packageImage, setPackageImage] = useState<string | undefined>(pkg.image);
  const isBestValue = pkg.name === 'Gold';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPackageImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-full">
      <div
        className={`relative rounded-2xl p-8 h-full transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl flex flex-col ${
          isSelected
            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-2xl border-2 border-emerald-300 ring-4 ring-emerald-500/30'
            : 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 text-white border border-emerald-500/20 hover:border-emerald-400/40'
        }`}
      >
        {/* Best Value Badge */}
        {isBestValue && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            BEST VALUE
          </div>
        )}

        {/* Package Image with Upload */}
        <div className="relative mb-6 h-32 group rounded-lg overflow-hidden">
          {packageImage ? (
            <img
              src={packageImage}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-700/50 flex items-center justify-center text-6xl">
              {pkg.icon}
            </div>
          )}
          <label className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100">
            <Upload className="text-white w-8 h-8" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </label>
        </div>

        {/* Name */}
        <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>

        {/* Description */}
        <p className={`text-sm mb-6 flex-grow ${
          isSelected ? 'text-emerald-100' : 'text-slate-400'
        }`}>
          {pkg.description}
        </p>

        {/* Amount */}
        <div className="mb-8">
          <div className="text-5xl font-bold">GHS {pkg.amount}</div>
          <span className={`text-sm ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
            Ghana Cedis
          </span>
        </div>

        {/* Details Grid */}
        <div className={`space-y-4 mb-8 pb-6 border-b ${isSelected ? 'border-emerald-400/50' : 'border-slate-700'}`}>
          <div className="flex items-center justify-between">
            <span className={isSelected ? 'text-emerald-100' : 'text-slate-400'}>Return Rate:</span>
            <span className="font-bold text-lg">{pkg.returnPercentage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={isSelected ? 'text-emerald-100' : 'text-slate-400'}>Duration:</span>
            <span className="font-bold text-lg">{pkg.durationDays} Days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={isSelected ? 'text-emerald-100' : 'text-slate-400'}>Estimated Return:</span>
            <span className="font-bold text-lg">GHS {Math.round(pkg.amount * pkg.returnPercentage / 100)}</span>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8 flex-grow">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Instant matching with verified members</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Transparent transaction process</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Secure & encrypted</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Fast payouts</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelect(pkg)}
          className={`w-full py-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 text-lg ${
            isSelected
              ? 'bg-white text-emerald-600 hover:bg-slate-100'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
          }`}
        >
          {isSelected && <Check className="w-6 h-6" />}
          {isSelected ? 'Selected' : 'Choose Package'}
        </button>
      </div>
    </div>
  );
};

interface PackagesGridProps {
  packages: Package[];
  onSelectPackage: (pkg: Package) => void;
  selectedPackageId?: string;
}

export const PackagesGrid: React.FC<PackagesGridProps> = ({
  packages,
  onSelectPackage,
  selectedPackageId,
}) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <PackageCardComponent
            key={pkg.id}
            pkg={pkg}
            onSelect={onSelectPackage}
            isSelected={selectedPackageId === pkg.id}
          />
        ))}
      </div>
    </div>
  );
};
