# FlexiGift Smart Contracts

Stylus-based smart contracts for FlexiGift, written in Rust and compiled to WASM.

## Overview

FlexiGift uses Arbitrum Stylus to deploy high-performance smart contracts written in Rust. These contracts manage on-chain gift cards with features like:

- **Gift Card Creation**: Lock USDC with expiry dates and merchant restrictions
- **Flexible Redemption**: Spend across multiple allowed merchants
- **Auto-Refund**: Unused balances automatically refundable after expiry
- **Gas Efficiency**: 10x cheaper than traditional Solidity contracts

## Prerequisites

- Rust 1.65 or newer
- `cargo-stylus` CLI tool
- Docker (for local testing)

## Installation

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install cargo-stylus:
```bash
cargo install cargo-stylus
```

3. Install dependencies:
```bash
cd contracts
cargo build
```

## Development

### Build

```bash
cargo build --release
```

### Check Contract Validity

```bash
cargo stylus check --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

### Deploy to Arbitrum Sepolia

```bash
cargo stylus deploy \
  --private-key <YOUR_PRIVATE_KEY> \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

### Export ABI

```bash
cargo stylus export-abi
```

## Contract Architecture

### FlexiGiftContract

Main contract managing gift card lifecycle:

- `create_gift_card(amount, expiry_days, merchants)` - Create new gift card
- `redeem_gift_card(id, amount, merchant)` - Redeem gift card
- `refund_gift_card(id)` - Refund unused balance after expiry
- `get_gift_card(id)` - Get gift card details

### Storage Structure

```rust
pub struct GiftCard {
    id: U256,
    giver: Address,
    amount: U256,
    remaining_balance: U256,
    expiry_timestamp: U256,
    is_active: bool,
    created_at: U256,
}
```

## Testing

Run tests:
```bash
cargo test
```

## Gas Optimization

Stylus contracts are optimized for:
- Lower memory usage (WASM vs EVM)
- Faster execution
- Reduced gas costs (~10x cheaper than Solidity)

## Security

- Reentrancy protection via Rust ownership model
- Type safety enforced at compile time
- Pausable functionality for emergencies

## License

MIT
