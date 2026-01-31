import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Testimonials } from '../components/Testimonials';
import { PackagesGrid } from '../components/PackagesGrid';
import { PackagesModal } from '../components/PackagesModal';
import { PACKAGES } from '../utils/mockData';
import { Heart, TrendingUp, Users, Shield, ArrowRight, Sparkles } from 'lucide-react';

export const HomePageNew: React.FC = () => {
  const navigate = useNavigate();
  const [showPackagesModal, setShowPackagesModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">Trusted by 10,000+ Members Worldwide</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Mutual Aid <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Network</span>
              </h1>
              <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-light">Help. Earn. Thrive.</p>
              <p className="text-lg text-slate-400 mb-8 max-w-3xl md:max-w-xl md:mx-0 mx-auto">
                Join a vibrant community where mutual aid brings real rewards. Give help, earn returns, and build stronger connections.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-emerald-500/50 flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 border-2 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 font-bold rounded-lg transition-all duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="hidden md:block">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10"></div>
                <div className="aspect-video flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-emerald-200 text-sm font-semibold">
                    ✓ Live Dashboard
                    <span className="text-emerald-100">Manage your mutual aid experience</span>
                  </div>
                  <div className="w-24 h-24 rounded-full border-2 border-emerald-400/60 flex items-center justify-center bg-slate-900/60">
                    <Heart className="w-10 h-10 text-emerald-300" />
                  </div>
                  <p className="text-slate-300 text-sm max-w-sm">
                    Access your dashboard to track earnings, monitor packages, and connect with community members in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">$0</div>
                <p className="text-slate-300 font-medium">Hidden Fees</p>
                <p className="text-slate-500 text-sm mt-1">Complete transparency</p>
              </div>
              <div className="text-center border-l border-r border-emerald-500/20 px-8">
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">30-50%</div>
                <p className="text-slate-300 font-medium">Return on Help</p>
                <p className="text-slate-500 text-sm mt-1">Earn while you give</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">3-15 Days</div>
                <p className="text-slate-300 font-medium">Fast Payouts</p>
                <p className="text-slate-500 text-sm mt-1">Get rewarded quickly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">About Mutual Aid Network</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">What We Do</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                We've created a revolutionary platform where financial empowerment meets community values. Our members don't just exchange money—they exchange trust, support, and opportunities.
              </p>
              <p className="text-slate-300 leading-relaxed mb-6">
                Every transaction strengthens our community. Every help given creates opportunities. Every return earned validates your generosity and impact.
              </p>
              <a href="/about" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Learn Our Story <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="relative h-96 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <Users className="w-16 h-16 text-emerald-400" />
                <div>
                  <p className="text-white font-bold text-lg">Community-Driven Finance</p>
                  <p className="text-slate-300 text-sm mt-2">Transparent platform for giving, receiving, and growing together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Why Choose Mutual Aid Network?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-8 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <Heart className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">Give Help</h3>
              <p className="text-slate-300 text-sm">Support verified members and make a real impact</p>
            </div>

            <div className="group p-8 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <TrendingUp className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">Earn Returns</h3>
              <p className="text-slate-300 text-sm">30-50% returns on every help you provide</p>
            </div>

            <div className="group p-8 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <Shield className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">100% Secure</h3>
              <p className="text-slate-300 text-sm">ID verification & encrypted transactions</p>
            </div>

            <div className="group p-8 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <Users className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
              <p className="text-slate-300 text-sm">Connect with thousands of verified members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">Choose Your Package</h2>
          <p className="text-slate-400 text-center mb-16 text-lg">Flexible options to match your needs and goals</p>
          
          {/* Button to open modal */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowPackagesModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-emerald-500/50"
            >
              View All Packages
            </button>
          </div>
          
          <PackagesGrid packages={PACKAGES} onSelectPackage={() => setShowPackagesModal(true)} />
        </div>

        {/* Packages Modal */}
        <PackagesModal
          isOpen={showPackagesModal}
          onClose={() => setShowPackagesModal(false)}
          packages={PACKAGES}
          onSelect={(pkg) => {
            console.log('Selected package:', pkg);
            navigate('/register');
          }}
        />
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: '1',
                title: 'Register',
                description: 'Create account & verify your identity with ID documents'
              },
              {
                number: '2',
                title: 'Choose Package',
                description: 'Select help amount that matches your goals'
              },
              {
                number: '3',
                title: 'Add Payment',
                description: 'Set up payment method (Mobile, Card, or Bank)'
              },
              {
                number: '4',
                title: 'Earn Returns',
                description: 'Get matched & start earning your returns'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-300 text-sm">{step.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-emerald-500/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Helping?</h2>
          <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of members who are helping each other succeed. Your journey to making an impact starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/50 flex items-center justify-center gap-2"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 border-2 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 font-bold rounded-lg transition-all duration-200"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
            <p>&copy; 2026 Mutual Aid Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
