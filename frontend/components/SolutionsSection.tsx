
import React from 'react';
import { Cpu, Coins, TrendingUp } from 'lucide-react';

export const SolutionsSection: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center px-8 md:px-24 py-32">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.4em] text-green-500 mb-6">
              <span className="w-12 h-[1px] bg-green-500/50"></span>
              <span className="font-bold">Technology</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Built with Arbitrum Stylus
            </h2>
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              FlexiGift leverages the power of Rust + Stylus smart contracts on Arbitrum,
              delivering unprecedented performance and cost efficiency for on-chain gift cards.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Cpu className="text-green-500" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Rust Performance</h3>
                  <p className="text-white/60">
                    Stylus contracts compile to WASM for faster execution and lower memory usage than traditional EVM contracts.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Coins className="text-green-500" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">10x Cheaper Gas</h3>
                  <p className="text-white/60">
                    Arbitrum L2 combined with Stylus efficiency means significantly lower transaction costs for users.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Developer Tools</h3>
                  <p className="text-white/60">
                    Comprehensive SDK, analytics dashboard, and documentation to help developers integrate FlexiGift.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 rounded-3xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-white/60">Total Value Locked</span>
                  <span className="text-2xl font-bold text-white">$2.4M</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-white/60">Gift Cards Created</span>
                  <span className="text-2xl font-bold text-white">12,847</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-white/60">Redemption Rate</span>
                  <span className="text-2xl font-bold text-green-400">94%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-white/60">Gas Saved vs L1</span>
                  <span className="text-2xl font-bold text-green-400">$156K</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-white/80 text-center">
                  <span className="font-bold text-green-400">Live on Arbitrum Sepolia</span> • Mainnet coming soon
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
