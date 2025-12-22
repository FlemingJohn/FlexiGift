
import React from 'react';
import { Github, Twitter, FileText, ExternalLink, Gift } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative px-8 md:px-24 py-16 border-t border-white/5">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
                <Gift className="text-black" size={20} />
              </div>
              <span className="text-2xl font-bold text-white">FlexiGift</span>
            </div>
            <p className="text-white/60 max-w-md leading-relaxed mb-6">
              On-chain gift cards powered by Rust + Stylus smart contracts on Arbitrum.
              Reducing gift card waste with blockchain technology.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <Github size={18} className="text-white/60" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <Twitter size={18} className="text-white/60" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                <FileText size={18} className="text-white/60" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">SDK</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2">
                <span>Documentation</span>
                <ExternalLink size={14} />
              </a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors flex items-center space-x-2">
                <span>Arbitrum Stylus</span>
                <ExternalLink size={14} />
              </a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Analytics</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/40 text-sm">
            © 2025 FlexiGift. Built on Arbitrum.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-white/40 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
