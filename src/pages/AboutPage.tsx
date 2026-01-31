import React from 'react';
import { Navbar } from '../components/Navbar';
import { Testimonials } from '../components/Testimonials';
import { Heart, Shield, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-16">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Mutual Aid Network</h1>
          <p className="text-xl text-slate-300">Empowering communities through transparent, secure, and inclusive financial cooperation</p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We believe that financial empowerment should be accessible to everyone. The Mutual Aid Network was founded on the principle that communities thrive when members help each other succeed.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Our platform removes barriers to entry, providing a transparent, secure space where people can give help, receive support, and earn meaningful returns—all while building stronger community bonds.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center overflow-hidden">
              <div className="text-center z-10">
                <Heart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-slate-300 font-medium">Community First</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
              <Shield className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Security</h3>
              <p className="text-slate-300">Your trust is paramount. We use industry-leading security measures to protect your data and transactions.</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
              <Users className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Community</h3>
              <p className="text-slate-300">We're building a global community united by the principle of mutual aid and collective prosperity.</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-all">
              <Heart className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Transparency</h3>
              <p className="text-slate-300">Every transaction, return, and decision is clear and open. No hidden fees, no surprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="h-64 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 overflow-hidden">
                <img 
                  src="/CEO and Co Founder 1.jpg"
                  alt="Akosua Mensah"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Akosua Mensah</h3>
              <p className="text-emerald-400 font-semibold mb-4">Co-Founder & CEO</p>
              <p className="text-slate-300 text-sm">With 10+ years in fintech and community development, Akosua envisioned a platform where mutual aid is accessible to all.</p>
            </div>
            <div className="text-center">
              <div className="h-64 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 overflow-hidden">
                <img 
                  src="/CEO and Co Founder 2.jpg"
                  alt="Kwame Osei"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Kwame Osei</h3>
              <p className="text-emerald-400 font-semibold mb-4">Co-Founder & CTO</p>
              <p className="text-slate-300 text-sm">A blockchain and security expert, Kwame ensures our platform is built on the strongest technical foundation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">2021</div>
                <div className="w-1 h-20 bg-emerald-500/30 mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Founded</h3>
                <p className="text-slate-300">Mutual Aid Network is founded with a mission to democratize financial cooperation.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">2023</div>
                <div className="w-1 h-20 bg-emerald-500/30 mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">1,000 Members</h3>
                <p className="text-slate-300">We reached our first thousand verified members across West Africa.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">2024</div>
                <div className="w-1 h-20 bg-emerald-500/30 mt-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">$5M in Transactions</h3>
                <p className="text-slate-300">Facilitated over $5 million in peer-to-peer mutual aid transactions.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">2026</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Global Expansion</h3>
                <p className="text-slate-300">Expanding to 50+ countries with multilingual support and localized payment methods.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Join the Movement?</h2>
          <p className="text-slate-300 mb-8 text-lg">Be part of a community that believes in mutual aid and collective prosperity.</p>
          <a href="/register" className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
};
