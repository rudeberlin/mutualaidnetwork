import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/Navbar';
import { TrendingUp, Shield, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-dark-900 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="heading-lg mb-4 leading-tight">
                Grow Your Wealth With{' '}
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  Peer-to-Peer Investing
                </span>
              </h1>
              <p className="text-xl text-dark-300 mb-6">
                Join thousands of community members earning 30-50% ROI through transparent,
                secure peer-to-peer investments. Quick returns, low risk, and complete transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn-outline flex items-center justify-center gap-2">
                  Learn More
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 space-y-3 text-dark-300 text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-gold-400" />
                  <span>Verified & Secure Platform</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-gold-400" />
                  <span>Real Members, Real Results</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-gold-400" />
                  <span>Transparent Fund Management</span>
                </div>
              </div>
            </div>

            {/* Hero Image - Homepage Images */}
            <div className="hidden md:flex md:flex-col gap-6">
              {/* Main Image */}
              <div className="glass-lg rounded-2xl overflow-hidden aspect-video flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-gold-500/20 group hover:border-gold-400/50 transition-all">
                <img 
                  src="/Homepage 1.jpg"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Stats Cards Below Image */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-lg p-4 rounded-lg text-center hover:bg-white/10 transition">
                  <p className="text-gold-400 font-bold text-lg">30-50%</p>
                  <p className="text-slate-400 text-xs">Annual ROI</p>
                </div>
                <div className="glass-lg p-4 rounded-lg text-center hover:bg-white/10 transition">
                  <p className="text-emerald-400 font-bold text-lg">24/7</p>
                  <p className="text-slate-400 text-xs">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Moved after hero */}
      <section className="px-4 py-20 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-md mb-4">Why Choose Mutual Aid Network?</h2>
            <p className="text-dark-300 max-w-2xl mx-auto">
              We provide the tools and security you need to invest with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Secure',
                description: 'Bank-level encryption and verified member system',
              },
              {
                icon: Zap,
                title: 'Fast',
                description: 'Quick matching and rapid ROI disbursement',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Real people helping real people grow wealth',
              },
              {
                icon: TrendingUp,
                title: 'Transparent',
                description: 'Complete visibility into all transactions and funds',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card-glass text-center group hover:ring-2 hover:ring-gold-400">
                  <Icon className="mx-auto mb-4 text-gold-400 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="heading-md text-lg mb-2">{feature.title}</h3>
                  <p className="text-dark-300 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: '10,000+', label: 'Active Members' },
              { stat: 'GHS 50M+', label: 'Funds Managed' },
              { stat: '98%', label: 'Success Rate' },
            ].map((item, idx) => (
              <div key={idx} className="card-glass text-center">
                <p className="heading-lg text-gold-400 mb-2">{item.stat}</p>
                <p className="text-dark-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Preview */}
      <section className="px-4 py-20 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-md text-center mb-12">Quick Plans Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'Basic Help', amount: 'GHS 250', roi: '30%', duration: '5 Days' },
              { name: 'Standard Help', amount: 'GHS 500', roi: '30%', duration: '5 Days' },
              { name: 'Premium Help', amount: 'GHS 1,500', roi: '50%', duration: '15 Days' },
              { name: 'Elite Help', amount: 'GHS 2,500', roi: '50%', duration: '15 Days' },
            ].map((plan, idx) => (
              <div key={idx} className="glass-lg p-6 rounded-lg text-center hover:bg-white/15 transition">
                <h3 className="font-semibold text-gold-400 mb-3">{plan.name}</h3>
                <div className="space-y-2 text-sm text-dark-300 mb-4">
                  <p>{plan.amount}</p>
                  <p className="text-gold-400 font-semibold">{plan.roi} ROI</p>
                  <p>{plan.duration}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/about" className="btn-outline">
              View Full Plans
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto card-glass text-center">
          <h2 className="heading-md mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-dark-300 mb-8">
            Join our community today and start growing your wealth with safe, transparent,
            peer-to-peer investments. No hidden fees. No surprises. Just real returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Create Free Account
            </Link>
            <Link to="/about" className="btn-secondary">
              View All Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="px-4 py-16 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="glass-lg p-8 rounded-xl text-center">
            <h3 className="heading-md text-lg mb-4">Try Our Demo</h3>
            <p className="text-dark-300 mb-6">
              Log in with any email and password to explore the full platform experience.
            </p>
            <Link to="/login" className="btn-primary inline-block">
              Try Demo Login
            </Link>
            <div className="mt-6 text-sm text-dark-400">
              <p>Demo Account (use any credentials):</p>
              <p className="text-gold-400">Email: test@example.com</p>
              <p className="text-gold-400">Password: demo1234</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
