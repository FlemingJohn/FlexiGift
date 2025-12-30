import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, DollarSign, Calendar, Store, Loader2, CheckCircle, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { useWallet } from '../hooks/useWallet';
import { FlexiGiftContract, getExplorerLink } from '../utils/contract';

interface GiftCardData {
    id: string;
    giver: string;
    amount: string;
    remainingBalance: string;
    expiryTimestamp: number;
    isActive: boolean;
    createdAt: number;
}

export const RedeemPage: React.FC = () => {
    const { giftCardId } = useParams<{ giftCardId: string }>();
    const navigate = useNavigate();
    const { signer, isConnected, address } = useWallet();

    const [giftCard, setGiftCard] = useState<GiftCardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [redeemAmount, setRedeemAmount] = useState('');
    const [selectedMerchant, setSelectedMerchant] = useState<number>(0);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [isRefunding, setIsRefunding] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    const merchants = [
        { id: 0, name: 'Amazon' },
        { id: 1, name: 'Uber' },
        { id: 2, name: 'Zomato' },
        { id: 3, name: 'Starbucks' },
        { id: 4, name: 'Netflix' },
    ];

    // Load gift card data
    useEffect(() => {
        const loadGiftCard = async () => {
            if (!giftCardId || !signer) {
                setLoading(false);
                return;
            }

            try {
                const contract = new FlexiGiftContract(signer);
                const data = await contract.getGiftCard(giftCardId);
                setGiftCard(data);
            } catch (err: any) {
                console.error('Failed to load gift card:', err);
                setError(err.message || 'Failed to load gift card');
            } finally {
                setLoading(false);
            }
        };

        if (signer) {
            loadGiftCard();
        }
    }, [giftCardId, signer]);

    const handleRedeem = async () => {
        if (!signer || !giftCard || !giftCardId) return;

        if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (parseFloat(redeemAmount) > parseFloat(giftCard.remainingBalance)) {
            setError('Amount exceeds remaining balance');
            return;
        }

        setIsRedeeming(true);
        setError(null);

        try {
            const contract = new FlexiGiftContract(signer);
            const result = await contract.redeemGiftCard(giftCardId, redeemAmount, selectedMerchant);
            setTxHash(result.txHash);

            // Reload gift card data
            const updatedData = await contract.getGiftCard(giftCardId);
            setGiftCard(updatedData);
            setRedeemAmount('');
        } catch (err: any) {
            console.error('Failed to redeem:', err);
            setError(err.message || 'Failed to redeem gift card');
        } finally {
            setIsRedeeming(false);
        }
    };

    const handleRefund = async () => {
        if (!signer || !giftCard || !giftCardId) return;

        const now = Math.floor(Date.now() / 1000);
        if (now < giftCard.expiryTimestamp) {
            setError('Gift card has not expired yet');
            return;
        }

        if (address?.toLowerCase() !== giftCard.giver.toLowerCase()) {
            setError('Only the gift giver can claim refund');
            return;
        }

        setIsRefunding(true);
        setError(null);

        try {
            const contract = new FlexiGiftContract(signer);
            const result = await contract.refundGiftCard(giftCardId);
            setTxHash(result.txHash);

            // Reload gift card data
            const updatedData = await contract.getGiftCard(giftCardId);
            setGiftCard(updatedData);
        } catch (err: any) {
            console.error('Failed to refund:', err);
            setError(err.message || 'Failed to refund gift card');
        } finally {
            setIsRefunding(false);
        }
    };

    const isExpired = giftCard ? Math.floor(Date.now() / 1000) > giftCard.expiryTimestamp : false;
    const isGiver = giftCard && address ? address.toLowerCase() === giftCard.giver.toLowerCase() : false;
    const canRefund = isExpired && isGiver && giftCard && parseFloat(giftCard.remainingBalance) > 0;

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <ParticlesBackground />
                </div>
                <Navbar />
                <div className="relative z-10 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4" size={48} />
                    <p className="text-white/60">Loading gift card...</p>
                </div>
            </div>
        );
    }

    if (!giftCard) {
        return (
            <div className="relative min-h-screen bg-[#050505] text-white">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <ParticlesBackground />
                </div>
                <Navbar />
                <main className="relative z-10 pt-32 pb-20 px-8 md:px-24">
                    <div className="max-w-2xl mx-auto text-center">
                        <AlertCircle className="mx-auto mb-6 text-red-500" size={64} />
                        <h1 className="text-3xl font-bold mb-4">Gift Card Not Found</h1>
                        <p className="text-white/60 mb-8">{error || 'The gift card you are looking for does not exist.'}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-green-500/30 selection:text-green-400">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParticlesBackground />
            </div>

            <Navbar />

            <main className="relative z-10 pt-32 pb-20 px-8 md:px-24">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>

                    {/* Gift Card Details */}
                    <div className="glass-card p-8 md:p-12 rounded-3xl mb-8">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                                <Gift className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">Gift Card #{giftCardId}</h1>
                                <p className="text-white/60 mt-1">
                                    {giftCard.isActive && !isExpired ? 'Active' : isExpired ? 'Expired' : 'Inactive'}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-white/60 text-sm mb-2">Original Amount</p>
                                <p className="text-3xl font-bold text-white">${giftCard.amount} USDC</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-white/60 text-sm mb-2">Remaining Balance</p>
                                <p className="text-3xl font-bold text-green-400">${giftCard.remainingBalance} USDC</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <span className="text-white/60">Expiry Date</span>
                                <span className="text-white font-semibold">
                                    {new Date(giftCard.expiryTimestamp * 1000).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <span className="text-white/60">Created</span>
                                <span className="text-white font-semibold">
                                    {new Date(giftCard.createdAt * 1000).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <span className="text-white/60">Gift Giver</span>
                                <span className="text-white font-mono text-sm">
                                    {giftCard.giver.slice(0, 6)}...{giftCard.giver.slice(-4)}
                                </span>
                            </div>
                        </div>

                        {/* Custom Message */}
                        {giftCard.message && giftCard.message.trim() !== '' && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                                <div className="flex items-start space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Gift className="text-green-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white/60 text-sm mb-1">Message from {giftCard.giver.slice(0, 6)}...{giftCard.giver.slice(-4)}</p>
                                        <p className="text-white text-lg italic leading-relaxed">"{giftCard.message}"</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Redeem Section */}
                    {giftCard.isActive && !isExpired && parseFloat(giftCard.remainingBalance) > 0 && (
                        <div className="glass-card p-8 md:p-12 rounded-3xl mb-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Redeem Gift Card</h2>

                            {!isConnected && (
                                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start space-x-3">
                                    <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-yellow-400 text-sm">Please connect your wallet to redeem</p>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-white font-semibold mb-3">Amount (USDC)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={24} />
                                    <input
                                        type="number"
                                        value={redeemAmount}
                                        onChange={(e) => setRedeemAmount(e.target.value)}
                                        placeholder={`Max: ${giftCard.remainingBalance}`}
                                        max={giftCard.remainingBalance}
                                        className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
                                    <Store size={24} />
                                    <span>Select Merchant</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {merchants.map((merchant) => (
                                        <button
                                            key={merchant.id}
                                            onClick={() => setSelectedMerchant(merchant.id)}
                                            className={`p-4 rounded-xl border-2 transition-all font-semibold ${selectedMerchant === merchant.id
                                                ? 'bg-green-500/20 border-green-500 text-white'
                                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                                                }`}
                                        >
                                            {merchant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {txHash && (
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <CheckCircle className="text-green-500" size={20} />
                                        <p className="text-green-400 font-semibold">Redemption Successful!</p>
                                    </div>
                                    <a
                                        href={getExplorerLink(txHash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors text-sm"
                                    >
                                        <span>View on Arbiscan</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            )}

                            <button
                                onClick={handleRedeem}
                                disabled={isRedeeming || !isConnected}
                                className="w-full px-8 py-5 bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-full font-bold text-xl transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center justify-center space-x-3"
                            >
                                {isRedeeming ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Redeeming...</span>
                                    </>
                                ) : (
                                    <>
                                        <Gift size={24} />
                                        <span>Redeem Now</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Refund Section */}
                    {canRefund && (
                        <div className="glass-card p-8 md:p-12 rounded-3xl">
                            <h2 className="text-2xl font-bold text-white mb-4">Claim Refund</h2>
                            <p className="text-white/60 mb-6">
                                This gift card has expired. As the gift giver, you can claim the unused balance of ${giftCard.remainingBalance} USDC.
                            </p>

                            <button
                                onClick={handleRefund}
                                disabled={isRefunding || !isConnected}
                                className="w-full px-8 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-full font-bold text-xl transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-3"
                            >
                                {isRefunding ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Processing Refund...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={24} />
                                        <span>Claim Refund</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Expired/Inactive Message */}
                    {(!giftCard.isActive || (isExpired && !canRefund)) && (
                        <div className="glass-card p-8 rounded-3xl text-center">
                            <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
                            <h3 className="text-xl font-bold text-white mb-2">
                                {!giftCard.isActive ? 'Gift Card Inactive' : 'Gift Card Expired'}
                            </h3>
                            <p className="text-white/60">
                                {!giftCard.isActive
                                    ? 'This gift card has been fully redeemed or refunded.'
                                    : 'This gift card has expired and all funds have been refunded.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
