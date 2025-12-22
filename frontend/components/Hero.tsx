
import React, { useEffect, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center px-8 md:px-24 overflow-hidden">
      {/* Parallax Background Text */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.02]"
        style={{ transform: `translateY(${offset * 0.4}px)` }}
      >
        <h2 className="text-[30vw] font-black tracking-tighter text-white whitespace-nowrap">
          FLEXI
        </h2>
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10 grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 mt-12">
          <div
            className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.4em] text-green-500 mb-8"
            style={{ transform: `translateY(${offset * -0.1}px)` }}
          >
            <span className="w-12 h-[1px] bg-green-500/50"></span>
            <span className="font-bold">Built on Arbitrum</span>
            <span className="w-4 h-[1px] bg-green-500/50"></span>
          </div>

          <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tighter text-white">
            <span style={{ display: 'block', transform: `translateY(${offset * -0.05}px)` }}>Gift Cards</span>
            <span style={{ display: 'block', transform: `translateY(${offset * -0.02}px)` }}>Without</span>
            <span className="relative inline-block mt-4" style={{ transform: `translateY(${offset * 0.02}px)` }}>
              Waste
              <span className="absolute -right-8 top-[0.6em] w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_30px_rgba(34,197,94,1)]"></span>
            </span>
          </h1>

          <div className="mt-16 flex items-center space-x-4" style={{ transform: `translateY(${offset * 0.05}px)` }}>
            <button className="px-8 py-3 bg-white text-black rounded-full font-bold flex items-center space-x-3 group hover:bg-green-500 hover:text-white transition-all duration-300">
              <span className="text-sm">Create Gift Card</span>
              <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center transition-all group-hover:bg-white/20">
                <div className="w-2 h-2 bg-black group-hover:bg-white rounded-full" />
              </div>
            </button>
          </div>
        </div>

        <div
          className="lg:col-span-4 self-center lg:text-right"
          style={{ transform: `translateY(${offset * 0.15}px)` }}
        >
          <p className="max-w-[280px] ml-auto text-sm text-white/40 leading-relaxed font-light mt-12 lg:mt-0">
            On-chain gift cards powered by Rust + Stylus smart contracts. Flexible spending, auto-refunds, and 10x cheaper gas fees on Arbitrum.
          </p>
        </div>
      </div>

      <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block" />

      <div className="absolute bottom-12 left-12 md:left-24 flex items-center space-x-6 text-[10px] tracking-[0.3em] text-white/30 uppercase font-bold">
        <div className="animate-bounce">
          <ChevronDown size={14} />
        </div>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
};
