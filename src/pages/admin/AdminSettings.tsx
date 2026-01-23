import React, { useState } from 'react';

export const AdminSettings: React.FC = () => {
  const [branding, setBranding] = useState({
    name: 'Mutual Aid Network',
    primaryColor: '#10b981',
    secondaryColor: '#0ea5e9',
    about: 'Peer-to-peer help platform building trust and growth.',
  });
  const [features, setFeatures] = useState({
    enableReferrals: true,
    enableVerification: true,
    enableHelpChat: false,
  });
  const [rules, setRules] = useState({
    minVerificationDocs: 2,
    autoApproveThreshold: 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-emerald-300 text-sm">Platform configuration</p>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <h3 className="text-white font-semibold">Branding</h3>
          <label className="text-sm text-slate-300">Platform Name
            <input
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              value={branding.name}
              onChange={(e) => setBranding({ ...branding, name: e.target.value })}
            />
          </label>
          <label className="text-sm text-slate-300">Primary Color
            <input
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              value={branding.primaryColor}
              onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
            />
          </label>
          <label className="text-sm text-slate-300">Secondary Color
            <input
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              value={branding.secondaryColor}
              onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
            />
          </label>
          <label className="text-sm text-slate-300">About
            <textarea
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              rows={3}
              value={branding.about}
              onChange={(e) => setBranding({ ...branding, about: e.target.value })}
            />
          </label>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <h3 className="text-white font-semibold">Features</h3>
          <label className="flex items-center justify-between text-sm text-slate-300">
            Enable Referrals
            <input
              type="checkbox"
              checked={features.enableReferrals}
              onChange={(e) => setFeatures({ ...features, enableReferrals: e.target.checked })}
              className="accent-emerald-500"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-slate-300">
            Require Verification
            <input
              type="checkbox"
              checked={features.enableVerification}
              onChange={(e) => setFeatures({ ...features, enableVerification: e.target.checked })}
              className="accent-emerald-500"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-slate-300">
            Enable Help Chat
            <input
              type="checkbox"
              checked={features.enableHelpChat}
              onChange={(e) => setFeatures({ ...features, enableHelpChat: e.target.checked })}
              className="accent-emerald-500"
            />
          </label>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 md:w-1/2">
        <h3 className="text-white font-semibold">Verification Rules</h3>
        <label className="text-sm text-slate-300">Minimum Documents
          <input
            type="number"
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            value={rules.minVerificationDocs}
            onChange={(e) => setRules({ ...rules, minVerificationDocs: Number(e.target.value) })}
          />
        </label>
        <label className="text-sm text-slate-300">Auto Approve Threshold ($)
          <input
            type="number"
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            value={rules.autoApproveThreshold}
            onChange={(e) => setRules({ ...rules, autoApproveThreshold: Number(e.target.value) })}
          />
        </label>
        <button className="w-full md:w-auto px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold">Save Settings</button>
      </div>
    </div>
  );
};
