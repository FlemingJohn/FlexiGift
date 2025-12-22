
import React from 'react';
import { Mail, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center px-8 md:px-24 py-32">
      <div className="max-w-4xl w-full mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.4em] text-green-500 mb-6">
          <span className="w-12 h-[1px] bg-green-500/50"></span>
          <span className="font-bold">Get Started</span>
          <span className="w-12 h-[1px] bg-green-500/50"></span>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Ready to Transform Gift Cards?
        </h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
          Join the future of gift cards on Arbitrum. Create your first on-chain gift card today.
        </p>

        <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold transition-all duration-300 hover:bg-green-500 hover:text-white flex items-center justify-center space-x-2">
              <span>Get Early Access</span>
              <Send size={18} />
            </button>
          </div>
          <p className="text-white/40 text-sm mt-6">
            Be the first to know when we launch on Arbitrum mainnet
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">Rust</div>
            <div className="text-sm text-white/40">Stylus SDK</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">L2</div>
            <div className="text-sm text-white/40">Arbitrum</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">USDC</div>
            <div className="text-sm text-white/40">Stablecoin</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">SDK</div>
            <div className="text-sm text-white/40">TypeScript</div>
          </div>
        </div>
      </div>
    </div>
  );
};
