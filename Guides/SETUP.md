# FlexiGift Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### 1. Rust Toolchain (v1.81 or newer)

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Set default toolchain to 1.81
rustup default 1.81

# Add WASM build target
rustup target add wasm32-unknown-unknown --toolchain 1.81
```

### 2. cargo-stylus CLI

```bash
# Install cargo-stylus
cargo install --force cargo-stylus

# Verify installation
cargo stylus --help
```

### 3. Node.js & npm (for frontend)

```bash
# Check if installed
node --version
npm --version
```

### 4. Docker (optional, for local testing)

Download from: https://www.docker.com/products/docker-desktop

---

## Project Setup

### 1. Clone the Repository

```bash
cd d:\Projects\FlexiGift
```

### 2. Smart Contracts Setup

```bash
cd contracts

# Build the contract
cargo build --release

# Check if contract is valid
cargo stylus check --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## Deployment to Arbitrum Sepolia

### Step 1: Get Testnet ETH

1. Visit [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
2. Enter your wallet address
3. Receive testnet ETH

### Step 2: Set Environment Variables

Create `.env` file in `contracts/` directory:

```bash
PRIVATE_KEY=your_private_key_here
ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
```

### Step 3: Estimate Gas

```bash
cd contracts

cargo stylus deploy \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --private-key $PRIVATE_KEY \
  --estimate-gas
```

### Step 4: Deploy Contract

```bash
# Deploy and activate
cargo stylus deploy \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --private-key $PRIVATE_KEY
```

**Note**: Deployment involves TWO transactions:
1. Contract deployment (uploads WASM bytecode)
2. Contract activation (compiles to native machine code)

### Step 5: Export ABI

```bash
# Export Solidity-compatible ABI
cargo stylus export-abi > ../frontend/src/contracts/FlexiGift.json
```

---

## Important Notes

### Contract Reactivation

Stylus contracts must be reactivated:
- **Once per year** (365 days)
- **After any Stylus upgrade**

Reactivate using:
```bash
cargo stylus activate \
  --address <CONTRACT_ADDRESS> \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --private-key $PRIVATE_KEY
```

### Gas Costs

- Stylus uses **"ink"** instead of gas (1 gas = ~1000 ink)
- WASM execution is ~10x cheaper than EVM
- Deployment costs are similar to Solidity

### Testnet vs Mainnet

**Arbitrum Sepolia (Testnet)**:
- RPC: `https://sepolia-rollup.arbitrum.io/rpc`
- Chain ID: `421614`
- Explorer: https://sepolia.arbiscan.io/

**Arbitrum One (Mainnet)**:
- RPC: `https://arb1.arbitrum.io/rpc`
- Chain ID: `42161`
- Explorer: https://arbiscan.io/

---

## Useful Commands

### cargo-stylus Commands

```bash
# Create new project
cargo stylus new <project-name>

# Check contract validity
cargo stylus check --endpoint <RPC_URL>

# Deploy contract
cargo stylus deploy --endpoint <RPC_URL> --private-key <KEY>

# Activate existing contract
cargo stylus activate --address <ADDRESS> --endpoint <RPC_URL>

# Export ABI
cargo stylus export-abi

# Verify deployment
cargo stylus verify --address <ADDRESS> --endpoint <RPC_URL>

# Trace transaction
cargo stylus trace <TX_HASH> --endpoint <RPC_URL>
```

### Testing

```bash
# Run Rust tests
cargo test

# Run with output
cargo test -- --nocapture
```

---

## Troubleshooting

### Issue: "WASM target not found"
```bash
rustup target add wasm32-unknown-unknown --toolchain 1.81
```

### Issue: "cargo-stylus not found"
```bash
cargo install --force cargo-stylus
```

### Issue: "Insufficient funds"
- Get testnet ETH from faucet
- Check wallet balance on Arbiscan

### Issue: "Contract activation failed"
- Ensure contract is deployed first
- Check RPC endpoint is correct
- Verify private key has sufficient ETH

---

## Resources

- **Arbitrum Docs**: https://docs.arbitrum.io/
- **Stylus Quickstart**: https://docs.arbitrum.io/stylus/quickstart
- **Stylus SDK**: https://docs.rs/stylus-sdk/
- **Arbitrum Discord**: https://discord.gg/arbitrum
- **Stylus Telegram**: https://t.me/arbitrum_stylus
- **Awesome Stylus**: https://github.com/OffchainLabs/awesome-stylus

---

## Next Steps

1. ✅ Complete setup
2. ✅ Deploy to Arbitrum Sepolia
3. 🚧 Build TypeScript SDK
4. 🚧 Integrate frontend with contracts
5. 🚧 Create analytics dashboard
6. 📋 Deploy to Arbitrum One mainnet
