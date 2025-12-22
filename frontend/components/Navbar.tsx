
import React, { useState } from 'react';
import { Gift } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
          <Gift className="text-black" size={20} />
        </div>
        <span className="text-xl font-bold tracking-widest text-white">FlexiGift</span>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Launch App</button>
        <button
          onClick={() => setIsToggled(!isToggled)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isToggled ? 'bg-green-500' : 'bg-white/20'}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isToggled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>
    </nav>
  );
};
