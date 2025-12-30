import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { ARBITRUM_SEPOLIA } from '../config';

interface WalletState {
    address: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    chainId: string | null;
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    error: string | null;
}

export const useWallet = () => {
    const [wallet, setWallet] = useState<WalletState>({
        address: null,
        isConnected: false,
        isConnecting: false,
        chainId: null,
        provider: null,
        signer: null,
        error: null,
    });

    // Check if MetaMask is installed
    const isMetaMaskInstalled = useCallback(() => {
        return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    }, []);

    // Connect wallet
    const connect = useCallback(async () => {
        if (!isMetaMaskInstalled()) {
            setWallet(prev => ({ ...prev, error: 'Please install MetaMask' }));
            return;
        }

        setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            const provider = new BrowserProvider(window.ethereum);

            // Request account access
            const accounts = await provider.send('eth_requestAccounts', []);
            const address = accounts[0];

            // Get network
            const network = await provider.getNetwork();
            const chainId = '0x' + network.chainId.toString(16);

            // Get signer
            const signer = await provider.getSigner();

            // Check if on Arbitrum Sepolia
            if (chainId !== ARBITRUM_SEPOLIA.chainId) {
                // Try to switch network
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: ARBITRUM_SEPOLIA.chainId }],
                    });
                } catch (switchError: any) {
                    // Network doesn't exist, add it
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [ARBITRUM_SEPOLIA],
                        });
                    } else {
                        throw switchError;
                    }
                }
            }

            setWallet({
                address,
                isConnected: true,
                isConnecting: false,
                chainId,
                provider,
                signer,
                error: null,
            });
        } catch (error: any) {
            console.error('Failed to connect wallet:', error);
            setWallet(prev => ({
                ...prev,
                isConnecting: false,
                error: error.message || 'Failed to connect wallet',
            }));
        }
    }, [isMetaMaskInstalled]);

    // Disconnect wallet
    const disconnect = useCallback(() => {
        setWallet({
            address: null,
            isConnected: false,
            isConnecting: false,
            chainId: null,
            provider: null,
            signer: null,
            error: null,
        });
    }, []);

    // Listen for account changes
    useEffect(() => {
        if (!isMetaMaskInstalled()) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnect();
            } else {
                setWallet(prev => ({ ...prev, address: accounts[0] }));
            }
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, [isMetaMaskInstalled, disconnect]);

    // Check if already connected on mount
    useEffect(() => {
        if (!isMetaMaskInstalled()) return;

        const checkConnection = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const accounts = await provider.send('eth_accounts', []);

                if (accounts.length > 0) {
                    const address = accounts[0];
                    const network = await provider.getNetwork();
                    const chainId = '0x' + network.chainId.toString(16);
                    const signer = await provider.getSigner();

                    setWallet({
                        address,
                        isConnected: true,
                        isConnecting: false,
                        chainId,
                        provider,
                        signer,
                        error: null,
                    });
                }
            } catch (error) {
                console.error('Failed to check connection:', error);
            }
        };

        checkConnection();
    }, [isMetaMaskInstalled]);

    return {
        ...wallet,
        connect,
        disconnect,
        isMetaMaskInstalled: isMetaMaskInstalled(),
    };
};

// Type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}
