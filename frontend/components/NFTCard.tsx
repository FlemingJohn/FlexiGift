import React from 'react';

interface NFTCardProps {
    id: string;
    amount: string;
    remainingBalance: string;
    giver: string;
    expiryDate: string;
    isRedeemed?: boolean;
    className?: string;
}

export const NFTCard: React.FC<NFTCardProps> = ({
    id,
    amount,
    remainingBalance,
    giver,
    expiryDate,
    isRedeemed = false,
    className = "",
}) => {
    // Format address for display
    const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <div className={`relative aspect-[1.586/1] w-full max-w-md group ${className}`}>
            {/* Animated Glow Background */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

            {/* Main Card Container */}
            <div className="relative h-full w-full bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6">

                {/* Top Section: Branding & ID */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-black fill-current">
                                <path d="M20 6H4V4h16v2zm0 4H4v2h16v-2zm-16 6h16v-2H4v2z" />
                            </svg>
                        </div>
                        <span className="text-white font-bold tracking-tight text-lg">FlexiGift</span>
                    </div>
                    <div className="text-right">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest leading-none mb-1">Card ID</p>
                        <p className="text-white font-mono text-sm">#{id.padStart(4, '0')}</p>
                    </div>
                </div>

                {/* Middle Section: Balance */}
                <div className="flex-1 flex flex-col justify-center">
                    <p className="text-white/40 text-xs mb-1 uppercase tracking-widest">Available Balance</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold text-white tracking-tighter">${remainingBalance}</span>
                        <span className="text-green-400 font-semibold">USDC</span>
                    </div>
                    <p className="text-white/20 text-[10px] mt-1 italic">Original Value: ${amount} USDC</p>
                </div>

                {/* Bottom Section: Giver & Expiry */}
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-end">
                    <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Giver</p>
                        <p className="text-white text-xs font-medium">{formatAddr(giver)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Expires</p>
                        <p className="text-white text-xs font-medium">{expiryDate}</p>
                    </div>
                </div>

                {/* Glassmorphism Overlays */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 blur-[60px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[50px] rounded-full"></div>

                {/* Redemption Stripe (if partially redeemed) */}
                {parseFloat(remainingBalance) < parseFloat(amount) && parseFloat(remainingBalance) > 0 && (
                    <div className="absolute top-0 right-0 p-2">
                        <div className="bg-orange-500/20 text-orange-400 text-[8px] px-2 py-0.5 rounded-full border border-orange-500/30">
                            PARTIALLY USED
                        </div>
                    </div>
                )}

                {/* Redeemed Overlay */}
                {parseFloat(remainingBalance) === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="border-2 border-red-500/50 rounded-lg px-4 py-2 rotate-[-12deg]">
                            <span className="text-red-500/50 font-black text-3xl tracking-tighter">REDEEMED</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
