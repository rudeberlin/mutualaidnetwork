import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Upload, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Testimonials } from '../components/Testimonials';
import { useAuthStore } from '../store';
import { validateEmail, validatePassword } from '../utils/helpers';
import { MOCK_CURRENT_USER } from '../utils/mockData';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'account' | 'documents'>('account');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    referralCode: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);

  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!validatePassword(formData.password))
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.terms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep('documents');
    }, 500);
  };

  const handleFileUpload = (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') {
        setIdFrontPreview(reader.result as string);
      } else {
        setIdBackPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idFrontPreview || !idBackPreview) {
      setErrors({ documents: 'Please upload both ID images' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser = {
        ...MOCK_CURRENT_USER,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        isVerified: false,
      };
      setUser(newUser);
      setToken('mock-token-12345');
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Form */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">Join Mutual Aids Network</h1>
              <p className="text-slate-400 text-lg">Start helping and earning with our community</p>
            </div>

            {/* Step Indicators */}
            <div className="flex gap-4 mb-8">
              <div className={`flex-1 h-1 rounded-full transition-all ${step === 'account' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
              <div className={`flex-1 h-1 rounded-full transition-all ${step === 'documents' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm">
              {step === 'account' ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>

                  {Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                      <p className="text-red-400 text-sm font-semibold">Please fix the errors below</p>
                    </div>
                  )}

                  <form onSubmit={handleAccountSubmit} className="space-y-5">
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-4 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-4 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-4 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        Referral Code <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                        <input
                          type="text"
                          name="referralCode"
                          value={formData.referralCode}
                          onChange={handleChange}
                          placeholder="e.g., MAN8493"
                          className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-4 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <p className="text-slate-500 text-xs mt-1">Have a referral code? Enter it to benefit from referrals</p>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                          className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-10 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                          className="w-full bg-slate-700/20 border border-slate-600/30 pl-10 pr-10 py-3 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-400"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-700 border border-slate-600" 
                      />
                      <span className="text-slate-300 text-sm">
                        I agree to the <a href="#" className="text-emerald-400 hover:text-emerald-300">Terms of Service</a> and <a href="#" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</a>
                      </span>
                    </label>
                    {errors.terms && <p className="text-red-400 text-xs">{errors.terms}</p>}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
                    >
                      {isLoading ? 'Loading...' : 'Continue to Verification'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Verify Your Identity</h2>

                  {errors.documents && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                      <p className="text-red-400 text-sm">{errors.documents}</p>
                    </div>
                  )}

                  <form onSubmit={handleDocumentSubmit} className="space-y-6">
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-3">ID Front Side</label>
                      <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-emerald-500/50 cursor-pointer transition-all">
                        <Upload className="text-slate-400 mb-2" size={24} />
                        <span className="text-slate-300 text-sm font-semibold">Click to upload</span>
                        <span className="text-slate-500 text-xs mt-1">PNG, JPG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('front', e)}
                          className="hidden"
                        />
                      </label>
                      {idFrontPreview && (
                        <div className="mt-3 relative">
                          <img src={idFrontPreview} alt="ID Front" className="w-full rounded-lg h-40 object-cover" />
                          <span className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            <CheckCircle size={14} /> Uploaded
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-3">ID Back Side</label>
                      <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-emerald-500/50 cursor-pointer transition-all">
                        <Upload className="text-slate-400 mb-2" size={24} />
                        <span className="text-slate-300 text-sm font-semibold">Click to upload</span>
                        <span className="text-slate-500 text-xs mt-1">PNG, JPG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('back', e)}
                          className="hidden"
                        />
                      </label>
                      {idBackPreview && (
                        <div className="mt-3 relative">
                          <img src={idBackPreview} alt="ID Back" className="w-full rounded-lg h-40 object-cover" />
                          <span className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            <CheckCircle size={14} /> Uploaded
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep('account')}
                        className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-emerald-500/30 hover:text-slate-200 transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isLoading ? 'Submitting...' : 'Complete Registration'}
                      </button>
                    </div>
                  </form>
                </>
              )}

              <div className="border-t border-slate-700/50 mt-6 pt-6">
                <p className="text-center text-slate-300 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Benefits & Testimonials */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Get Started in 3 Steps</h3>
              {[
                { number: '1', title: 'Create Account', desc: 'Sign up with your basic info' },
                { number: '2', title: 'Verify Identity', desc: 'Upload your ID documents' },
                { number: '3', title: 'Start Helping', desc: 'Help others and earn rewards' },
              ].map((s, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700/30 hover:border-emerald-500/30 transition-all">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">{s.number}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{s.title}</p>
                    <p className="text-slate-400 text-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">What Members Say</h3>
              <Testimonials />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
