import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { useWallet } from '../hooks/useWallet';
import { FlexiGiftContract } from '../utils/contract';
import { NFTCard } from '../components/NFTCard';
import { Loader2, Grid, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GalleryPage: React.FC = () => {
    const { isConnected, address, signer } = useWallet();
    const [nfts, setNfts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (!isConnected || !address || !signer) {
                setIsLoading(false);
                return;
            }

            try {
                const contract = new FlexiGiftContract(signer);
                const results = await contract.getMyNFTs(address);
                setNfts(results);
            } catch (error) {
                console.error('Failed to fetch NFTs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNFTs();
    }, [isConnected, address, signer]);

    return (
        <div className="min-h-screen bg-[#050505]">
            <Navbar />
            <ParticlesBackground />

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2 text-green-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
                                <span className="w-8 h-[1px] bg-green-500/30"></span>
                                <span>Stylus Protocol</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                                My Gift <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">NFTs</span>
                            </h1>
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                                {nfts.length} Assets Found on Arbitrum
                            </p>
                        </div>
                    </div>

                    {!isConnected ? (
                        <div className="glass-card p-12 rounded-3xl text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Connect your wallet to view your NFTs</h2>
                            <p className="text-white/60 mb-8">Your digital gift cards are stored securely on the blockchain.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="text-green-500 animate-spin mb-4" size={48} />
                            <p className="text-white/60 font-medium tracking-wide">Scanning blockchain for your assets...</p>
                        </div>
                    ) : nfts.length === 0 ? (
                        <div className="glass-card p-20 rounded-[32px] text-center border border-white/5">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Info className="text-green-400" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">No NFTs Found</h2>
                            <p className="text-white/60 mb-10 max-w-md mx-auto">You haven't created or received any gift cards yet. Start gifting today and own your assets as NFTs!</p>
                            <Link
                                to="/create"
                                className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-2xl transition-all hover:scale-105"
                            >
                                Send Your First Gift
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {nfts.map((nft) => (
                                <Link key={nft.id} to={`/redeem/${nft.id}`} className="transition-transform hover:scale-[1.02]">
                                    <NFTCard
                                        id={nft.id}
                                        amount={nft.amount}
                                        remainingBalance={nft.remainingBalance}
                                        giver={nft.giver}
                                        expiryDate={new Date(nft.expiryTimestamp * 1000).toLocaleDateString()}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
