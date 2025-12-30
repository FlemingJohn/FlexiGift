
import React from 'react';
import { Gift } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Navbar: React.FC = () => {

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
          <Gift className="text-black" size={20} />
        </div>
        <span className="text-xl font-bold tracking-widest text-white">FlexiGift</span>
      </div>

      <div className="flex items-center space-x-6">
        <WalletConnect />
      </div>
    </nav>
  );
};
