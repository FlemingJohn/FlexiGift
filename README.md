# FlexiGift - Arbitrum Stylus Gift Cards

> On-chain gift cards powered by Rust + Stylus smart contracts on Arbitrum

[![Arbitrum](https://img.shields.io/badge/Arbitrum-Stylus-blue)](https://arbitrum.io/stylus)
[![Rust](https://img.shields.io/badge/Rust-1.81+-orange)](https://www.rust-lang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎯 Problem

Over **20% of gift cards go unused annually**, wasting billions of dollars due to:
- Brand-locked cards
- Expiry dates
- Forgotten balances

## ✨ Solution

FlexiGift uses **Arbitrum Stylus** (Rust → WASM) to create:
- **Flexible gift cards** - Spend across multiple merchants
- **Auto-refunds** - Unused balances return after expiry
- **10x cheaper gas** - WASM efficiency vs traditional EVM
- **Full transparency** - All transactions on-chain

## 🏗️ Architecture

### Smart Contracts (Rust + Stylus)
- **GiftCard Contract**: Create, redeem, and refund logic
- **Merchant Registry**: Allowlist management
- **USDC Integration**: Stablecoin-based gift cards

### Frontend (React + Vite)
- Modern landing page
- Wallet connection (MetaMask)
- Gift card creation/redemption UI

### Developer Tools
- Analytics dashboard (coming soon)

## 🚀 Quick Start

### Prerequisites
```bash 
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Set toolchain and add WASM target
rustup default 1.81
rustup target add wasm32-unknown-unknown --toolchain 1.81

# Install cargo-stylus
cargo install --force cargo-stylus
```

### Deploy Contract
```bash
cd contracts

# Check validity
cargo stylus check --endpoint https://sepolia-rollup.arbitrum.io/rpc

# Deploy (requires testnet ETH)
cargo stylus deploy \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --private-key <YOUR_PRIVATE_KEY>
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Complete development environment setup
- [Stylus Guide](Guides/STYLUS_GUIDE.md) - Smart contract development
- [PRD](Guides/PRD.md) - Product requirements
- [Project Structure](PROJECT_STRUCTURE.md) - Codebase organization

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Smart Contracts | Rust + Stylus SDK |
| Blockchain | Arbitrum Sepolia / Arbitrum One |
| Token | USDC (ERC-20) |
| Frontend | React + Vite + Tailwind CSS |
| Web3 | ethers.js v6 |
| Deployment | cargo-stylus CLI |

## 📊 Key Features

- ✅ **Rust Performance**: 10x cheaper gas than Solidity
- ✅ **Interoperable**: Full compatibility with Solidity contracts
- ✅ **Secure**: Rust's compile-time safety guarantees
- ✅ **Transparent**: All transactions verifiable on-chain
- ✅ **Developer-Friendly**: Comprehensive documentation

## 🎯 Hackathon Categories

This project targets **3 Arbitrum categories**:
1. **Stylus-based contracts and tools** ✅
2. **Dashboards and developer tools** ✅
3. **Orbit chain experiments** (optional)

## 🔗 Resources

- **Arbitrum Docs**: https://docs.arbitrum.io/
- **Stylus Quickstart**: https://docs.arbitrum.io/stylus/quickstart
- **Stylus SDK**: https://docs.rs/stylus-sdk/
- **Arbitrum Discord**: https://discord.gg/arbitrum
- **Awesome Stylus**: https://github.com/OffchainLabs/awesome-stylus

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

**Built with ❤️ on Arbitrum Stylus**
