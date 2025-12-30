# Stylus Smart Contract Development Guide

## What is Stylus?

Arbitrum Stylus allows you to write smart contracts in Rust (and C/C++) that compile to WebAssembly (WASM) and run on Arbitrum chains. These contracts are:

- **10x cheaper** in gas costs compared to Solidity
- **Fully interoperable** with existing Solidity contracts
- **Memory efficient** due to WASM execution
- **Type-safe** with Rust's compile-time guarantees

## FlexiGift Contract Architecture

### Core Components

1. **GiftCard Struct**: Stores gift card data
   - ID, giver address, amount, balance
   - Expiry timestamp, active status
   
2. **Storage Maps**: Efficient on-chain storage
   - `gift_cards`: ID → GiftCard
   - `allowed_merchants`: ID → Merchant list
   - `merchant_names`: ID → Name

3. **Public Functions**:
   - `create_gift_card()`: Lock USDC, set expiry
   - `redeem_gift_card()`: Spend at allowed merchants
   - `refund_gift_card()`: Claim unused balance
   - `add_merchant()`: Register new merchants

### Key Features

#### 1. Gift Card Creation
```rust
create_gift_card(amount, expiry_days, merchant_indices)
```
- Locks USDC in contract
- Sets expiry based on days
- Restricts to specific merchants
- Emits `GiftCardCreated` event

#### 2. Redemption
```rust
redeem_gift_card(gift_card_id, amount, merchant_index)
```
- Validates expiry and balance
- Checks merchant allowlist
- Updates remaining balance
- Transfers USDC to recipient

#### 3. Auto-Refund
```rust
refund_gift_card(gift_card_id)
```
- Only callable after expiry
- Only by original giver
- Returns unused balance
- Deactivates gift card

## Development Workflow

### 1. Setup Environment

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install cargo-stylus
cargo install cargo-stylus

# Clone and build
cd contracts
cargo build --release
```

### 2. Local Testing

```bash
# Run unit tests
cargo test

# Check contract validity
cargo stylus check --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

### 3. Deploy to Testnet

```bash
# Set private key
export PRIVATE_KEY=your_key_here

# Deploy (Bash)
./deploy.sh

# Or PowerShell
./deploy.ps1 -PrivateKey "your_key_here"
```

### 4. Verify Deployment

- Check Arbiscan: https://sepolia.arbiscan.io/
- Verify contract address in `deployment.json`
- Test contract calls via frontend

## Gas Optimization Tips

1. **Use WASM-optimized types**: `U256`, `Address` from `alloy-primitives`
2. **Minimize storage writes**: Batch updates when possible
3. **Use events for indexing**: Don't store data that can be derived from events
4. **Leverage Rust's zero-cost abstractions**: Compiler optimizations

## Security Considerations

1. **Reentrancy**: Rust's ownership model prevents reentrancy by default
2. **Integer Overflow**: Checked by default in Rust
3. **Access Control**: Owner-only functions with explicit checks
4. **Pausable**: Emergency stop mechanism
5. **Input Validation**: All inputs validated before state changes

## Interoperability with Solidity

Stylus contracts can:
- Call Solidity contracts
- Be called by Solidity contracts
- Share the same ABI format
- Use the same events and types

Example:
```rust
sol! {
    event GiftCardCreated(uint256 indexed id, address indexed giver);
}
```

## Next Steps

1. **Add ERC20 Integration**: Implement USDC transfer logic
2. **Enhanced Testing**: Integration tests with mock USDC
3. **Mainnet Deployment**: Deploy to Arbitrum One
4. **Upgradability**: Consider proxy pattern for upgrades

## Resources

- [Stylus Documentation](https://docs.arbitrum.io/stylus/stylus-gentle-introduction)
- [Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs)
- [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
- [OpenZeppelin Stylus](https://github.com/OpenZeppelin/rust-contracts-stylus)
