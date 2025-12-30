# Frontend Blockchain Integration

## Overview

Successfully integrated Web3 functionality into the FlexiGift frontend with MetaMask wallet connection and Arbitrum Stylus contract interactions.

## Components Created

### 1. Configuration (`config.ts`)
- Arbitrum Sepolia network configuration
- Contract addresses (FlexiGift, USDC)
- Network parameters (RPC, chain ID, explorer)

### 2. Wallet Hook (`hooks/useWallet.ts`)
- MetaMask connection/disconnection
- Automatic network switching to Arbitrum Sepolia
- Account and chain change listeners
- Persistent connection state

### 3. Contract Utilities (`utils/contract.ts`)
- `FlexiGiftContract` class for contract interactions
- Create gift card function (with USDC approval)
- Redeem gift card function
- Refund gift card function
- Get gift card details
- Helper functions for formatting addresses and transaction hashes

### 4. UI Components

#### `WalletConnect.tsx`
- Connect/disconnect wallet button
- MetaMask installation check
- Connected wallet display with address
- Link to Arbiscan explorer

#### `CreateGiftCardModal.tsx`
- Gift card creation form
- Amount input (USDC)
- Expiry days selection
- Merchant selection (multi-select)
- Transaction status handling
- Success screen with transaction link

### 5. Updated Components

#### `Navbar.tsx`
- Integrated `WalletConnect` component
- Replaced "Launch App" button with wallet connection

#### `Hero.tsx`
- Added "Create Gift Card" button functionality
- Wallet connection check before opening modal
- Integrated `CreateGiftCardModal`

## User Flow

1. **Connect Wallet**
   - User clicks "Connect Wallet" in Navbar
   - MetaMask prompts for connection
   - Auto-switches to Arbitrum Sepolia if needed
   - Displays connected address

2. **Create Gift Card**
   - User clicks "Create Gift Card" in Hero section
   - Modal opens with form
   - User enters amount, expiry, and selects merchants
   - Approves USDC spending (Transaction 1)
   - Creates gift card (Transaction 2)
   - Success screen shows gift card ID and transaction link

3. **View on Explorer**
   - User can click explorer links to view transactions on Arbiscan

## Technical Details

### Dependencies
- `ethers@^6.13.0` - Web3 library for Ethereum interactions

### Network Configuration
- **Chain**: Arbitrum Sepolia
- **Chain ID**: 421614 (0x66eee)
- **RPC**: https://sepolia-rollup.arbitrum.io/rpc
- **Explorer**: https://sepolia.arbiscan.io

### Contract Interactions

All contract calls use the Stylus-compatible ABI:
```typescript
createGiftCard(amount, expiryDays, merchantIndices)
redeemGiftCard(giftCardId, amount, merchantIndex)
refundGiftCard(giftCardId)
getGiftCard(giftCardId)
```

### USDC Integration
- USDC approval required before gift card creation
- Amount converted to 6 decimals (USDC standard)
- Balance checking available

## Next Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Update Contract Address**
   - Deploy contract to Arbitrum Sepolia
   - Update `CONTRACTS.FLEXIGIFT` in `config.ts`

3. **Test Wallet Connection**
   - Run `npm run dev`
   - Connect MetaMask
   - Verify network switching

4. **Test Gift Card Creation**
   - Get testnet USDC
   - Create a gift card
   - Verify transaction on Arbiscan

## Files Modified

- `frontend/package.json` - Added ethers.js
- `frontend/config.ts` - Network configuration
- `frontend/hooks/useWallet.ts` - Wallet hook
- `frontend/utils/contract.ts` - Contract utilities
- `frontend/components/WalletConnect.tsx` - New component
- `frontend/components/CreateGiftCardModal.tsx` - New component
- `frontend/components/Navbar.tsx` - Integrated wallet
- `frontend/components/Hero.tsx` - Integrated modal

## Known Issues

- Contract address needs to be updated after deployment
- ABI is placeholder - will be replaced with actual ABI from `cargo stylus export-abi`
- Need to install dependencies: `npm install`
