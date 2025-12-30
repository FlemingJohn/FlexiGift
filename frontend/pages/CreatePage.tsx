import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Calendar, DollarSign, Store, Loader2, CheckCircle, ExternalLink, AlertCircle, MessageSquare } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { useWallet } from '../hooks/useWallet';
import { FlexiGiftContract, getExplorerLink } from '../utils/contract';

export const CreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { signer, isConnected, address } = useWallet();
    const [amount, setAmount] = useState('');
    const [expiryDays, setExpiryDays] = useState('30');
    const [selectedMerchants, setSelectedMerchants] = useState<number[]>([0, 1, 2]);
    const [message, setMessage] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [giftCardId, setGiftCardId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const merchants = [
        { id: 0, name: 'Amazon' },
        { id: 1, name: 'Uber' },
        { id: 2, name: 'Zomato' },
        { id: 3, name: 'Starbucks' },
        { id: 4, name: 'Netflix' },
    ];

    const toggleMerchant = (id: number) => {
        setSelectedMerchants(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!signer || !isConnected) {
            setError('Please connect your wallet first');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (selectedMerchants.length === 0) {
            setError('Please select at least one merchant');
            return;
        }

        // Validate message length
        if (message.length > 280) {
            setError('Message must be 280 characters or less');
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            const contract = new FlexiGiftContract(signer);
            const result = await contract.createGiftCard(amount, parseInt(expiryDays), selectedMerchants, message);

            setTxHash(result.txHash);
            setGiftCardId(result.giftCardId || null);
        } catch (err: any) {
            console.error('Failed to create gift card:', err);
            setError(err.message || 'Failed to create gift card');
        } finally {
            setIsCreating(false);
        }
    };

    const handleReset = () => {
        setAmount('');
        setExpiryDays('30');
        setSelectedMerchants([0, 1, 2]);
        setMessage('');
        setTxHash(null);
        setGiftCardId(null);
        setError(null);
    };

    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-green-500/30 selection:text-green-400">
            {/* Background */}
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

                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                            <Gift className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Create Gift Card</h1>
                            <p className="text-white/60 mt-2">On-chain gift cards powered by Arbitrum Stylus</p>
                        </div>
                    </div>

                    {txHash ? (
                        /* Success State */
                        <div className="glass-card p-12 rounded-3xl text-center">
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="text-green-500" size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">Gift Card Created!</h2>
                            {giftCardId && (
                                <>
                                    <p className="text-white/60 text-lg mb-4">Gift Card ID: #{giftCardId}</p>

                                    {/* Shareable Link */}
                                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-white/60 text-sm mb-2">Share this link with the recipient:</p>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={`${window.location.origin}/redeem/${giftCardId}`}
                                                readOnly
                                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/redeem/${giftCardId}`);
                                                    alert('Link copied to clipboard!');
                                                }}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                            <a
                                href={getExplorerLink(txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors mb-8"
                            >
                                <span>View on Arbiscan</span>
                                <ExternalLink size={18} />
                            </a>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-all"
                                >
                                    Create Another
                                </button>
                                {giftCardId && (
                                    <button
                                        onClick={() => navigate(`/redeem/${giftCardId}`)}
                                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold transition-all border border-white/10"
                                    >
                                        View Gift Card
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold transition-all border border-white/10"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Create Form */
                        <div className="glass-card p-8 md:p-12 rounded-3xl">
                            {!isConnected && (
                                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start space-x-3">
                                    <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-yellow-400 text-sm">Please connect your wallet to create a gift card</p>
                                </div>
                            )}

                            {/* Amount Input */}
                            <div className="mb-6">
                                <label className="block text-white font-semibold mb-3 text-lg">Amount (USDC)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={24} />
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="50.00"
                                        className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Expiry Days */}
                            <div className="mb-6">
                                <label className="block text-white font-semibold mb-3 text-lg">Expiry (Days)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={24} />
                                    <input
                                        type="number"
                                        value={expiryDays}
                                        onChange={(e) => setExpiryDays(e.target.value)}
                                        placeholder="30"
                                        className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Custom Message */}
                            <div className="mb-8">
                                <label className="block text-white font-semibold mb-3 text-lg flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <MessageSquare size={24} />
                                        <span>Personal Message (Optional)</span>
                                    </div>
                                    <span className={`text-sm ${message.length > 280 ? 'text-red-400' : 'text-white/40'}`}>
                                        {message.length}/280
                                    </span>
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Add a heartfelt message to your gift... (e.g., 'Happy Birthday! Enjoy your special day! 🎉')"
                                    maxLength={280}
                                    rows={4}
                                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-base placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors resize-none"
                                />
                                {message.length > 0 && (
                                    <div className="mt-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                        <p className="text-sm text-white/60 mb-1">Preview:</p>
                                        <p className="text-white italic">"{message}"</p>
                                    </div>
                                )}
                                <p className="text-white/40 text-xs mt-2">
                                    💡 Tip: Messages are stored on-chain and are public. Keep them appropriate!
                                </p>
                            </div>

                            {/* Merchant Selection */}
                            <div className="mb-8">
                                <label className="block text-white font-semibold mb-4 text-lg flex items-center space-x-2">
                                    <Store size={24} />
                                    <span>Allowed Merchants</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {merchants.map((merchant) => (
                                        <button
                                            key={merchant.id}
                                            onClick={() => toggleMerchant(merchant.id)}
                                            className={`p-4 rounded-xl border-2 transition-all font-semibold ${selectedMerchants.includes(merchant.id)
                                                ? 'bg-green-500/20 border-green-500 text-white'
                                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                                                }`}
                                        >
                                            {merchant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
                                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Create Button */}
                            <button
                                onClick={handleCreate}
                                disabled={isCreating || !isConnected}
                                className="w-full px-8 py-5 bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-full font-bold text-xl transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center justify-center space-x-3"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Gift size={24} />
                                        <span>Create Gift Card</span>
                                    </>
                                )}
                            </button>

                            <p className="text-white/40 text-sm mt-6 text-center">
                                This will require 2 transactions: USDC approval and gift card creation
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
