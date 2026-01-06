import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { useWallet } from '../hooks/useWallet';
import { FlexiGiftContract } from '../utils/contract';
import { NFTCard } from '../components/NFTCard';
import { Loader2, ShoppingCart, Search, Filter, Tag, ArrowRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MarketplacePage: React.FC = () => {
    const { isConnected, address, signer } = useWallet();
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [buyingId, setBuyingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            if (!signer) {
                setIsLoading(false);
                return;
            }
            try {
                const contract = new FlexiGiftContract(signer);
                const results = await contract.getAllListings();
                setListings(results);
            } catch (error) {
                console.error('Failed to fetch listings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, [signer]);

    const handleBuy = async (tokenId: string, price: string) => {
        if (!signer) return;
        setBuyingId(tokenId);
        try {
            const contract = new FlexiGiftContract(signer);
            await contract.buyGiftCard(tokenId, price);
            // Refresh listings
            const results = await contract.getAllListings();
            setListings(results);
            alert('Purchase successful! The NFT has been transferred to your wallet.');
        } catch (error: any) {
            console.error('Purchase failed:', error);
            alert(`Purchase failed: ${error.message}`);
        } finally {
            setBuyingId(null);
        }
    };

    const filteredListings = listings.filter(l =>
        l.id.includes(searchTerm) ||
        l.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505]">
            <Navbar />
            <ParticlesBackground />

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <ShoppingCart className="text-green-400" size={24} />
                                <span className="text-green-400 font-bold tracking-widest uppercase text-sm">Secondary Market</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                Gift Card <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Marketplace</span>
                            </h1>
                            <p className="text-white/40 mt-4 max-w-lg font-medium">
                                Buy unused gift cards at a discount or sell your unwanted cards for USDC. Instant settlement on Arbitrum.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID or message..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-green-500/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {!signer ? (
                        <div className="glass-card p-12 rounded-3xl text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Connect your wallet to browse the marketplace</h2>
                            <p className="text-white/60 mb-8">Join the Arbitrum ecosystem to trade digital assets securely.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="text-green-500 animate-spin mb-4" size={48} />
                            <p className="text-white/60 font-medium tracking-wide">Fetching active listings...</p>
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className="glass-card p-20 rounded-[32px] text-center border border-white/5">
                            <Tag className="text-white/20 mx-auto mb-6" size={64} />
                            <h2 className="text-2xl font-bold text-white mb-2">No active listings found</h2>
                            <p className="text-white/60">Be the first to list a gift card for sale!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredListings.map((l) => (
                                <div key={l.id} className="group relative flex flex-col">
                                    <Link to={`/redeem/${l.id}`} className="transition-transform hover:scale-[1.02] mb-6">
                                        <NFTCard
                                            id={l.id}
                                            amount={l.amount}
                                            remainingBalance={l.remainingBalance}
                                            giver={l.giver}
                                            expiryDate={new Date(l.expiryTimestamp * 1000).toLocaleDateString()}
                                        />
                                    </Link>

                                    {/* Listing Info & Buy Button */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Price</p>
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="text-2xl font-bold text-white">${l.price}</span>
                                                    <span className="text-green-400 text-xs font-bold uppercase">USDC</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Savings</p>
                                                <p className="text-emerald-400 font-bold">
                                                    {Math.max(0, Math.round((1 - parseFloat(l.price) / parseFloat(l.remainingBalance)) * 100))}% OFF
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleBuy(l.id, l.price)}
                                            disabled={buyingId === l.id || l.seller.toLowerCase() === address?.toLowerCase()}
                                            className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed text-black font-black rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center space-x-3"
                                        >
                                            {buyingId === l.id ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : l.seller.toLowerCase() === address?.toLowerCase() ? (
                                                <span>You are the seller</span>
                                            ) : (
                                                <>
                                                    <Wallet size={20} />
                                                    <span>Buy Now</span>
                                                </>
                                            )}
                                        </button>

                                        <div className="mt-4 flex items-center justify-center space-x-2">
                                            <p className="text-[10px] text-white/20 uppercase tracking-widest">Seller:</p>
                                            <p className="text-[10px] text-white/40 font-mono italic">{l.seller.slice(0, 8)}...{l.seller.slice(-6)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
