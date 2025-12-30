// Arbitrum Sepolia Configuration
export const ARBITRUM_SEPOLIA = {
    chainId: '0x66eee', // 421614 in hex
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
};

// Contract Addresses (update after deployment)
export const CONTRACTS = {
    FLEXIGIFT: '0x0000000000000000000000000000000000000000', // Update after deployment
    USDC: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // Arbitrum Sepolia USDC
};

// Network Configuration
export const NETWORK_CONFIG = {
    chainId: 421614,
    chainName: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
};
