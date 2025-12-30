
import React, { useState } from 'react';
import { Gift, X, Calendar, DollarSign, Store, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { FlexiGiftContract, getExplorerLink } from '../utils/contract';

interface CreateGiftCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateGiftCardModal: React.FC<CreateGiftCardModalProps> = ({ isOpen, onClose }) => {
    const { signer, isConnected } = useWallet();
    const [amount, setAmount] = useState('');
    const [expiryDays, setExpiryDays] = useState('30');
    const [selectedMerchants, setSelectedMerchants] = useState<number[]>([0, 1, 2]); // Default merchants
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

        setIsCreating(true);
        setError(null);

        try {
            const contract = new FlexiGiftContract(signer);
            const result = await contract.createGiftCard(amount, parseInt(expiryDays), selectedMerchants);

            setTxHash(result.txHash);
            setGiftCardId(result.giftCardId || null);
        } catch (err: any) {
            console.error('Failed to create gift card:', err);
            setError(err.message || 'Failed to create gift card');
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        setAmount('');
        setExpiryDays('30');
        setSelectedMerchants([0, 1, 2]);
        setTxHash(null);
        setGiftCardId(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-card p-8 rounded-3xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Gift className="text-white" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create Gift Card</h2>
                </div>

                {txHash ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-500" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Gift Card Created!</h3>
                        {giftCardId && (
                            <p className="text-white/60 mb-4">Gift Card ID: #{giftCardId}</p>
                        )}
                        <a
                            href={getExplorerLink(txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                        >
                            <span>View on Arbiscan</span>
                            <ExternalLink size={16} />
                        </a>
                        <button
                            onClick={handleClose}
                            className="mt-6 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-all"
                        >
                            Create Another
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Amount Input */}
                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-2">Amount (USDC)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="50.00"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Expiry Days */}
                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-2">Expiry (Days)</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="number"
                                    value={expiryDays}
                                    onChange={(e) => setExpiryDays(e.target.value)}
                                    placeholder="30"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Merchant Selection */}
                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
                                <Store size={20} />
                                <span>Allowed Merchants</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {merchants.map((merchant) => (
                                    <button
                                        key={merchant.id}
                                        onClick={() => toggleMerchant(merchant.id)}
                                        className={`p-3 rounded-xl border-2 transition-all ${selectedMerchants.includes(merchant.id)
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
                            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Create Button */}
                        <button
                            onClick={handleCreate}
                            disabled={isCreating || !isConnected}
                            className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center justify-center space-x-2"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Gift size={20} />
                                    <span>Create Gift Card</span>
                                </>
                            )}
                        </button>

                        <p className="text-white/40 text-xs mt-4 text-center">
                            This will require 2 transactions: USDC approval and gift card creation
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};
