import { useState, useEffect } from 'react';
import { Gift, Grid, Plus, ShoppingBag, Menu, X } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'My NFTs', path: '/gallery', icon: Grid },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'New Gift', path: '/create', icon: Plus },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4 flex justify-between items-center ${isScrolled
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
        }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-10 h-10 bg-gradient-to-br from-white to-white/80 flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-500">
          <Gift className="text-black group-hover:scale-110 transition-transform" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">FlexiGift</span>
          <span className="text-[8px] font-bold tracking-[0.4em] text-green-500 uppercase mt-0.5 opacity-80">Smart Gifting</span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="flex items-center space-x-8">
        <div className="hidden lg:flex items-center space-x-1 p-1 bg-white/5 rounded-full border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 ${isActive(link.path)
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
            >
              <link.icon size={14} />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <WalletConnect />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 lg:hidden bg-black/95 backdrop-blur-2xl p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-6 rounded-2xl font-black text-2xl uppercase tracking-tighter transition-all flex items-center justify-between ${isActive(link.path)
                    ? 'bg-green-500 text-black'
                    : 'bg-white/5 text-white/40'
                  }`}
              >
                <span>{link.name}</span>
                <link.icon size={24} />
              </Link>
            ))}
            <div className="pt-8 border-t border-white/10">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
