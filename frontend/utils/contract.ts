import { Contract } from 'ethers';
import { JsonRpcSigner } from 'ethers';
import { CONTRACTS } from '../config';

// Placeholder ABI - will be replaced with actual ABI from cargo stylus export-abi
const FLEXIGIFT_ABI = [
    'function createGiftCard(uint256 amount, uint256 expiryDays, uint256[] memory merchantIndices, string memory message, uint256 deliveryTimestamp) external returns (uint256)',
    'function redeemGiftCard(uint256 giftCardId, uint256 amount, uint256 merchantIndex) external',
    'function refundGiftCard(uint256 giftCardId) external',
    'function deliverGiftCard(uint256 giftCardId) external',
    'function cancelScheduledDelivery(uint256 giftCardId) external',
    'function getGiftCard(uint256 giftCardId) external view returns (tuple(uint256 id, address giver, uint256 amount, uint256 remainingBalance, uint256 expiryTimestamp, bool isActive, uint256 createdAt, string message, uint256 deliveryTimestamp, bool isDelivered))',
    'function addMerchant(string memory name) external returns (uint256)',
    'function getMerchantName(uint256 merchantId) external view returns (string)',
    'event GiftCardCreated(uint256 indexed giftCardId, address indexed giver, uint256 amount, uint256 expiryTimestamp, string message, uint256 deliveryTimestamp)',
    'event GiftCardRedeemed(uint256 indexed giftCardId, address indexed recipient, uint256 amount, uint256 remainingBalance)',
    'event GiftCardRefunded(uint256 indexed giftCardId, address indexed giver, uint256 refundAmount)',
    'event GiftCardDelivered(uint256 indexed giftCardId, uint256 deliveredAt)',
    'event ScheduledDeliveryCancelled(uint256 indexed giftCardId, address indexed giver)',
];

const USDC_ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function balanceOf(address account) external view returns (uint256)',
    'function decimals() external view returns (uint8)',
];

export class FlexiGiftContract {
    private contract: Contract;
    private usdcContract: Contract;

    constructor(signer: JsonRpcSigner) {
        this.contract = new Contract(CONTRACTS.FLEXIGIFT, FLEXIGIFT_ABI, signer);
        this.usdcContract = new Contract(CONTRACTS.USDC, USDC_ABI, signer);
    }

    // Create a new gift card
    async createGiftCard(
        amountUSDC: string,
        expiryDays: number,
        merchantIndices: number[],
        message: string = '',
        deliveryTimestamp: number = 0  // 0 = immediate, >0 = scheduled
    ) {
        try {
            // Convert USDC amount to wei (6 decimals)
            const amount = BigInt(parseFloat(amountUSDC) * 1_000_000);

            // Approve USDC spending first
            const approveTx = await this.usdcContract.approve(CONTRACTS.FLEXIGIFT, amount);
            await approveTx.wait();

            // Create gift card
            const tx = await this.contract.createGiftCard(
                amount,
                BigInt(expiryDays),
                merchantIndices,
                message,
                BigInt(deliveryTimestamp)
            );
            const receipt = await tx.wait();

            // Extract gift card ID from event
            const event = receipt.logs.find((log: any) => {
                try {
                    return this.contract.interface.parseLog(log)?.name === 'GiftCardCreated';
                } catch {
                    return false;
                }
            });

            if (event) {
                const parsed = this.contract.interface.parseLog(event);
                return {
                    giftCardId: parsed?.args.giftCardId.toString(),
                    txHash: receipt.hash,
                };
            }

            return { txHash: receipt.hash };
        } catch (error: any) {
            console.error('Failed to create gift card:', error);
            throw new Error(error.message || 'Failed to create gift card');
        }
    }

    // Redeem a gift card
    async redeemGiftCard(giftCardId: string, amountUSDC: string, merchantIndex: number) {
        try {
            const amount = BigInt(parseFloat(amountUSDC) * 1_000_000);
            const tx = await this.contract.redeemGiftCard(
                BigInt(giftCardId),
                amount,
                BigInt(merchantIndex)
            );
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (error: any) {
            console.error('Failed to redeem gift card:', error);
            throw new Error(error.message || 'Failed to redeem gift card');
        }
    }

    // Refund a gift card
    async refundGiftCard(giftCardId: string) {
        try {
            const tx = await this.contract.refundGiftCard(BigInt(giftCardId));
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (error: any) {
            console.error('Failed to refund gift card:', error);
            throw new Error(error.message || 'Failed to refund gift card');
        }
    }

    // Get gift card details
    async getGiftCard(giftCardId: string) {
        try {
            const data = await this.contract.getGiftCard(BigInt(giftCardId));
            return {
                id: data.id.toString(),
                giver: data.giver,
                amount: (Number(data.amount) / 1_000_000).toFixed(2),
                remainingBalance: (Number(data.remainingBalance) / 1_000_000).toFixed(2),
                expiryTimestamp: Number(data.expiryTimestamp),
                isActive: data.isActive,
                createdAt: Number(data.createdAt),
                message: data.message || '',
                deliveryTimestamp: Number(data.deliveryTimestamp),
                isDelivered: data.isDelivered,
            };
        } catch (error: any) {
            console.error('Failed to get gift card:', error);
            throw new Error(error.message || 'Failed to get gift card');
        }
    }

    // Get USDC balance
    async getUSDCBalance(address: string) {
        try {
            const balance = await this.usdcContract.balanceOf(address);
            return (Number(balance) / 1_000_000).toFixed(2);
        } catch (error: any) {
            console.error('Failed to get USDC balance:', error);
            return '0.00';
        }
    }

    // Deliver a scheduled gift card
    async deliverGiftCard(giftCardId: string) {
        try {
            const tx = await this.contract.deliverGiftCard(BigInt(giftCardId));
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (error: any) {
            console.error('Failed to deliver gift card:', error);
            throw new Error(error.message || 'Failed to deliver gift card');
        }
    }

    // Cancel scheduled delivery
    async cancelScheduledDelivery(giftCardId: string) {
        try {
            const tx = await this.contract.cancelScheduledDelivery(BigInt(giftCardId));
            const receipt = await tx.wait();
            return { txHash: receipt.hash };
        } catch (error: any) {
            console.error('Failed to cancel scheduled delivery:', error);
            throw new Error(error.message || 'Failed to cancel scheduled delivery');
        }
    }
}

// Utility function to format address
export const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to format transaction hash
export const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

// Utility function to get explorer link
export const getExplorerLink = (hash: string, type: 'tx' | 'address' = 'tx') => {
    const baseUrl = 'https://sepolia.arbiscan.io';
    return type === 'tx' ? `${baseUrl}/tx/${hash}` : `${baseUrl}/address/${hash}`;
};
