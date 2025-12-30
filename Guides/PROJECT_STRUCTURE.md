# FlexiGift Project Structure

```
FlexiGift/
├── contracts/                  # Stylus Smart Contracts (Rust)
│   ├── src/
│   │   ├── lib.rs             # Main FlexiGift contract
│   │   └── tests.rs           # Unit tests
│   ├── Cargo.toml             # Rust dependencies
│   ├── deploy.sh              # Deployment script (Bash)
│   ├── deploy.ps1             # Deployment script (PowerShell)
│   ├── .env.example           # Environment template
│   └── README.md              # Contract documentation
│
├── frontend/                   # Next.js Frontend
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── AssetAtlasSection.tsx
│   │   ├── SolutionsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── Footer.tsx
│   │   └── ParticlesBackground.tsx
│   ├── App.tsx                # Main app component
│   ├── index.html             # HTML entry point
│   ├── package.json           # NPM dependencies
│   └── vite.config.ts         # Vite configuration
│
├── sdk/                        # Developer SDK (Coming Soon)
│   ├── src/
│   │   ├── index.ts           # Main SDK exports
│   │   ├── contract.ts        # Contract interactions
│   │   └── types.ts           # TypeScript types
│   ├── package.json
│   └── README.md
│
├── dashboard/                  # Analytics Dashboard (Coming Soon)
│   ├── pages/
│   ├── components/
│   └── package.json
│
└── Guides/                     # Documentation
    ├── PRD.md                 # Product Requirements
    ├── STYLUS_GUIDE.md        # Stylus development guide
    └── SDK_GUIDE.md           # SDK integration guide (Coming Soon)
```

## Technology Stack

### Smart Contracts
- **Language**: Rust
- **Framework**: Stylus SDK
- **Blockchain**: Arbitrum Sepolia (Testnet) / Arbitrum One (Mainnet)
- **Token**: USDC (ERC-20)

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Web3**: ethers.js v6
- **Wallet**: MetaMask

### SDK
- **Language**: TypeScript
- **Build**: tsup
- **Package**: npm

### Dashboard
- **Framework**: Next.js
- **Charts**: Chart.js
- **Data**: The Graph (Subgraph)

## Development Status

✅ **Completed**:
- Landing page with FlexiGift branding
- Stylus smart contracts (Rust)
- Deployment scripts
- Documentation

🚧 **In Progress**:
- Contract deployment to testnet
- SDK development
- Frontend integration

📋 **Planned**:
- Analytics dashboard
- Subgraph for indexing
- Mainnet deployment
