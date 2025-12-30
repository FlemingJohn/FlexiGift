import React, { useState, useEffect } from 'react';
import { Gift, ArrowRight, CheckCircle, Sparkles, User, Store } from 'lucide-react';

export const ProductDemo: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const steps = [
        {
            id: 1,
            title: 'Create Gift Card',
            description: 'Alice creates a $50 USDC gift card for Bob',
            icon: Gift,
            color: 'from-green-500 to-emerald-500',
        },
        {
            id: 2,
            title: 'Share Link',
            description: 'Bob receives the shareable gift card link',
            icon: Sparkles,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            id: 3,
            title: 'Redeem at Merchant',
            description: 'Bob spends $30 at Uber, $20 remaining',
            icon: Store,
            color: 'from-purple-500 to-pink-500',
        },
        {
            id: 4,
            title: 'Auto-Refund',
            description: 'Unused $20 returns to Alice after expiry',
            icon: CheckCircle,
            color: 'from-orange-500 to-red-500',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setActiveStep((prev) => (prev + 1) % steps.length);
                setIsAnimating(false);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-32 px-8 md:px-24 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 mb-6">
                        <Sparkles className="text-green-400" size={16} />
                        <span className="text-sm font-semibold text-green-400">Interactive Demo</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        See It In <span className="text-green-400">Action</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Watch how FlexiGift eliminates gift card waste with smart contracts
                    </p>
                </div>

                {/* Demo Container */}
                <div className="glass-card p-8 md:p-12 rounded-3xl">
                    {/* Progress Bar */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${index <= activeStep
                                                    ? `bg-gradient-to-br ${step.color} scale-110`
                                                    : 'bg-white/5 scale-100'
                                                }`}
                                        >
                                            <step.icon
                                                className={`transition-colors ${index <= activeStep ? 'text-white' : 'text-white/40'
                                                    }`}
                                                size={20}
                                            />
                                        </div>
                                        <span
                                            className={`text-xs mt-2 transition-colors hidden md:block ${index <= activeStep ? 'text-white' : 'text-white/40'
                                                }`}
                                        >
                                            Step {step.id}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 h-1 mx-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ${index < activeStep ? 'w-full' : 'w-0'
                                                    }`}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Active Step Display */}
                    <div
                        className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                            }`}
                    >
                        <div className="text-center mb-8">
                            <div className={`inline-flex w-24 h-24 rounded-2xl bg-gradient-to-br ${steps[activeStep].color} items-center justify-center mb-6 animate-pulse`}>
                                {React.createElement(steps[activeStep].icon, {
                                    className: 'text-white',
                                    size: 40,
                                })}
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-3">{steps[activeStep].title}</h3>
                            <p className="text-xl text-white/60">{steps[activeStep].description}</p>
                        </div>

                        {/* Visual Representation */}
                        <div className="grid md:grid-cols-2 gap-6 mt-12">
                            {/* Before */}
                            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <User className="text-green-400" size={20} />
                                    <span className="text-white font-semibold">Alice (Giver)</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">USDC Balance</span>
                                        <span className="text-white font-mono">
                                            {activeStep === 0 ? '$100' : activeStep >= 3 ? '$70' : '$50'}
                                        </span>
                                    </div>
                                    {activeStep >= 1 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Gift Card Created</span>
                                            <span className="text-green-400 font-mono">$50</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* After */}
                            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <User className="text-blue-400" size={20} />
                                    <span className="text-white font-semibold">Bob (Recipient)</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Gift Card Balance</span>
                                        <span className="text-white font-mono">
                                            {activeStep < 2 ? '$0' : activeStep === 2 ? '$50' : activeStep === 3 ? '$20' : '$0'}
                                        </span>
                                    </div>
                                    {activeStep >= 3 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Spent at Uber</span>
                                            <span className="text-purple-400 font-mono">$30</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Key Benefit */}
                        <div className="mt-8 p-6 bg-green-500/10 rounded-xl border border-green-500/20">
                            <div className="flex items-center justify-center space-x-3">
                                <CheckCircle className="text-green-400" size={24} />
                                <p className="text-white font-semibold">
                                    {activeStep === 0 && 'On-chain gift cards with flexible spending'}
                                    {activeStep === 1 && 'Shareable links - no physical cards needed'}
                                    {activeStep === 2 && 'Spend at multiple merchants'}
                                    {activeStep === 3 && 'Automatic refunds - zero waste!'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Manual Controls */}
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === activeStep ? 'bg-green-500 w-8' : 'bg-white/20 hover:bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-green-500/30 inline-flex items-center space-x-3">
                        <span>Try It Yourself</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};
