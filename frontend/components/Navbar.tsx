
import { Gift, Grid, Plus, ShoppingBag } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
          <Gift className="text-black" size={20} />
        </div>
        <span className="text-xl font-bold tracking-widest text-white uppercase">FlexiGift</span>
      </Link>

      <div className="flex items-center space-x-8">
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/gallery" className="text-white/60 hover:text-white font-semibold transition-colors flex items-center space-x-1">
            <Grid size={18} />
            <span>My NFTs</span>
          </Link>
          <Link to="/marketplace" className="text-white/60 hover:text-white font-semibold transition-colors flex items-center space-x-1">
            <ShoppingBag size={18} />
            <span>Marketplace</span>
          </Link>
          <Link to="/create" className="text-white/60 hover:text-white font-semibold transition-colors flex items-center space-x-1">
            <Plus size={18} />
            <span>New Gift</span>
          </Link>
        </div>
        <WalletConnect />
      </div>
    </nav>
  );
};
