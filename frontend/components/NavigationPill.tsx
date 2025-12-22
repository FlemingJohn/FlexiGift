
import React from 'react';

interface NavigationPillProps {
  activeSection: string;
}

export const NavigationPill: React.FC<NavigationPillProps> = ({ activeSection }) => {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services', badge: '+' },
    { id: 'product', label: 'Product' },
    { id: 'about', label: 'About us' },
  ];

  return (
    <div className="glass-card rounded-full px-2 py-2 flex items-center space-x-1 shadow-2xl border border-white/5">
      {links.map((link) => (
        <button
          key={link.id}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center space-x-1
            ${activeSection === link.id 
              ? 'bg-white text-black' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
        >
          <span>{link.label}</span>
          {link.badge && <span className="text-[10px] opacity-50">{link.badge}</span>}
        </button>
      ))}
    </div>
  );
};
