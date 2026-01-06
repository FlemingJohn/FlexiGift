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
- **Smart Gifting** - Send value with a personal touch and timelocks
- **NFT Digital Assets** - Every gift card is a unique, transferable NFT (ERC-721)
- **Auto-refunds** - Unused balances return after expiry
- **10x cheaper gas** - WASM efficiency vs traditional EVM
- **Secondary Market** - Sell unused credits at a discount in the built-in Marketplace

## 🏗️ Architecture

### System Architecture
```mermaid
graph TB
    %% Class Definitions for Premium Styling
    classDef frontend fill:#111,stroke:#22c55e,stroke-width:2px,color:#fff;
    classDef blockchain fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef stylus fill:#064e3b,stroke:#22c55e,stroke-width:2px,color:#fff,font-weight:bold;
    classDef infra fill:#1e293b,stroke:#64748b,stroke-width:1px,color:#94a3b8;
    classDef external fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;

    subgraph FE ["&nbsp;&nbsp;FRONTEND (REACT + VITE)&nbsp;&nbsp;"]
        direction TB
        UI["Visual Components<br/>(Tailwind + Lucide)"]
        Pages["App Pages<br/>(Gallery, Marketplace, Create)"]
        Store["State Management<br/>(useWallet + useContract)"]
        Ethers["Ethers.js v6"]
    end

    subgraph SC ["&nbsp;&nbsp;ARBITRUM STYLUS (WASM)&nbsp;&nbsp;"]
        direction TB
        subgraph CoreLogic ["&nbsp;Core Logic (Rust)&nbsp;"]
            Core["Gift Card Logic"]
            NFT["ERC-721 Engine"]
            Mkt["Marketplace Escrow"]
        end
        Storage[("Stylus Optimized<br/>Storage Mapping")]
    end

    subgraph EXT ["&nbsp;&nbsp;EXTERNAL ECOSYSTEM&nbsp;&nbsp;"]
        USDC["USDC Stablecoin<br/>(ERC-20)"]
        IPFS["IPFS Storage<br/>(Metadata)"]
    end

    %% Connections
    UI --> Pages
    Pages --> Store
    Store --> Ethers
    Ethers -- "JSON-RPC (Sepolia)" --> CoreLogic
    CoreLogic --- Storage
    Mkt -. "Atomic Swap" .-> USDC
    CoreLogic -- "Direct Redemption" --> USDC
    Pages -- "Metadata API" --> IPFS

    %% Applying Classes
    class UI,Pages,Store,Ethers frontend;
    class CoreLogic,Core,NFT,Mkt blockchain;
    class SC,CoreLogic stylus;
    class USDC,EXT external;
    class IPFS infra;

    %% Subgraph Styling
    style FE fill:none,stroke:#22c55e,stroke-dasharray: 5 5
    style SC fill:none,stroke:#3b82f6,stroke-dasharray: 5 5
    style EXT fill:none,stroke:#818cf8,stroke-dasharray: 5 5
```

### Transaction Lifecycle
```mermaid
sequenceDiagram
    autonumber
    participant G as 🟢 Giver
    participant C as 🦀 Stylus Contract
    participant R as 🎁 Recipient (Holder)
    participant B as 🛒 Marketplace Buyer

    Note over G, C: 1. Creation & Escrow
    G->>C: createGiftCard(USDC + Params)
    Note right of C: Mint NFT (ERC-721)<br/>Lock USDC in Storage
    C-->>G: Confirmation (Tx Hash)

    Note over C, R: 2. Redemption Path
    alt Immediate Access
        R->>C: redeemGiftCard(Amount)
        C->>R: Unlock & Transfer USDC
    else Scheduled (Timelock)
        Note over G: Wait for Timestamp
        G->>C: deliverGiftCard()
        Note right of C: Unlock NFT Logic
        R->>C: redeemGiftCard(Amount)
        C->>R: Unlock & Transfer USDC
    end

    Note over G, B: 3. Secondary Trade
    G->>C: listGiftCard(Price)
    B->>C: buyGiftCard(Price)
    Note right of C: Atomic Swap:<br/>NFT to Buyer<br/>USDC to Seller
    B->>C: redeemGiftCard()
    C->>B: Unlock & Transfer USDC
```

## 🛠️ Project Modules

### Smart Contracts (Rust + Stylus)
- **GiftCard Core**: Creation, redemption, and lifecycle logic.
- **ERC-721 Engine**: Native NFT implementation for true digital ownership.
- **Marketplace Escrow**: Non-custodial listing and atomic settlement logic.

### Frontend Hub (React + Vite)
- **NFT Dashboard**: Glassmorphic UI for tracking and managing gift card assets.
- **Secondary Market**: P2P interface for browsing and buying discounted cards.
- **Gifting Suite**: Multi-step flow for custom messages and scheduled delivery.

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
- [Implementation Walkthrough](C:/Users/felix/.gemini/antigravity/brain/3b64ba1f-9ac5-41c2-957f-91b3dfbe54db/walkthrough.md) - Deep dive into feature implementation
- [Stylus Guide](Guides/STYLUS_GUIDE.md) - Smart contract development
- [PRD](Guides/PRD.md) - Product requirements
- [Project Structure](PROJECT_STRUCTURE.md) - Codebase organization

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Smart Contracts | Rust + Stylus SDK |
| Blockchain | Arbitrum Sepolia / Arbitrum One |
| Token Standards | ERC-20 (USDC), ERC-721 (NFT) |
| Frontend | React + Vite + Tailwind CSS |
| UI Icons | Lucide React |
| Web3 | ethers.js v6 |
| Deployment | cargo-stylus CLI |

## 📊 Key Features

- ✅ **NFT Ownership**: Gift cards are true digital assets transferable between wallets
- ✅ **Scheduled Delivery**: Schedule gifts for birthdays/holidays with high-accuracy timestamps
- ✅ **Custom Messaging**: Add heartfelt on-chain notes (up to 280 chars)
- ✅ **Marketplace**: Built-in P2P secondary market for gift card liquidity
- ✅ **Rust Performance**: 10x cheaper gas than Solidity via Stylus WASM execution
- ✅ **Interoperable**: Full compatibility with Solidity contracts
- ✅ **Secure**: Rust's compile-time safety guarantees
- ✅ **Transparent**: All transactions verifiable on-chain
- ✅ **Developer-Friendly**: Comprehensive documentation
- ✅ **Premium UX**: High-end glassmorphic design and real-time state updates

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
