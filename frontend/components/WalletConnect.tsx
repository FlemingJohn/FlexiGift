
import React, { useState } from 'react';
import { Wallet, X, ExternalLink, AlertCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { formatAddress, getExplorerLink } from '../utils/contract';

export const WalletConnect: React.FC = () => {
    const { address, isConnected, isConnecting, connect, disconnect, error, isMetaMaskInstalled } = useWallet();
    const [showModal, setShowModal] = useState(false);

    const handleConnect = async () => {
        if (!isMetaMaskInstalled) {
            window.open('https://metamask.io/download/', '_blank');
            return;
        }
        await connect();
        setShowModal(false);
    };

    if (isConnected && address) {
        return (
            <div className="flex items-center space-x-3">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center space-x-3 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{formatAddress(address)}</span>
                    <a
                        href={getExplorerLink(address, 'address')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-green-500 transition-colors"
                    >
                        <ExternalLink size={12} />
                    </a>
                </div>
                <button
                    onClick={disconnect}
                    className="w-10 h-10 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-white/40 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-300"
                    title="Disconnect"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 bg-white text-black hover:bg-green-500 hover:text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-white/5 flex items-center space-x-3 group"
            >
                <Wallet className="group-hover:rotate-12 transition-transform" size={16} />
                <span>Connect Wallet</span>
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="glass-card p-8 rounded-3xl max-w-md w-full mx-4 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">Connect Wallet</h2>

                        {error && (
                            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
                                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="w-full p-4 glass-card hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center space-x-4 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                                <Wallet className="text-white" size={24} />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-white font-bold">MetaMask</h3>
                                <p className="text-white/60 text-sm">
                                    {isMetaMaskInstalled ? 'Connect to Arbitrum Sepolia' : 'Install MetaMask'}
                                </p>
                            </div>
                            {isConnecting && (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            )}
                        </button>

                        <p className="text-white/40 text-xs mt-6 text-center">
                            By connecting, you agree to our Terms of Service
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
