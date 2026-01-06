import { Github, Twitter, FileText, ExternalLink, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="relative px-8 md:px-24 py-20 border-t border-white/5 bg-black">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-6">
            <div className="flex items-center space-x-3 mb-8 group">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Gift className="text-black" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">FlexiGift</span>
                <span className="text-[10px] font-bold tracking-[0.4em] text-green-500 uppercase mt-1">Smart Gifting</span>
              </div>
            </div>
            <p className="text-white/40 max-w-md leading-relaxed mb-8 text-sm">
              The world's most flexible on-chain gifting protocol.
              Powered by Rust + Stylus smart contracts on Arbitrum,
              ensuring 100% ownership and zero waste.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center transition-all duration-300">
                <Github size={20} className="text-white" />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center transition-all duration-300">
                <Twitter size={20} className="text-white" />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center transition-all duration-300">
                <FileText size={20} className="text-white" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-6 opacity-30">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/gallery" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">My NFTs</Link></li>
              <li><Link to="/marketplace" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/create" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Create Gift</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-6 opacity-30">Ecosystem</h4>
            <ul className="space-y-4">
              <li><a href="https://docs.arbitrum.io/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/60 hover:text-white transition-colors flex items-center space-x-2">
                <span>Documentation</span>
                <ExternalLink size={14} className="opacity-40" />
              </a></li>
              <li><a href="https://arbitrum.io/stylus" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/60 hover:text-white transition-colors flex items-center space-x-2">
                <span>Arbitrum Stylus</span>
                <ExternalLink size={14} className="opacity-40" />
              </a></li>
              <li><a href="#" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">On-chain Analytics</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
            <p className="text-white/20 text-xs font-medium uppercase tracking-widest">
              © 2025 FlexiGift Protocol
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-white/20 hover:text-white text-xs font-medium uppercase tracking-widest transition-colors">Privacy</a>
              <a href="#" className="text-white/20 hover:text-white text-xs font-medium uppercase tracking-widest transition-colors">Terms</a>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-white/20 text-xs font-bold uppercase tracking-[0.3em]">
            <span>Secured by</span>
            <span className="text-white/40">Arbitrum</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
