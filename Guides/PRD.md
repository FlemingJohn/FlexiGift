# FlexiGift - Arbitrum Ecosystem Project

## Problem (Good & Legit)

"Over 20% of gift cards go unused, wasting billions of dollars annually."

### Why this works:

* It's a real, documented consumer problem
* Happens due to:
  * Brand-locked cards
  * Expiry dates
  * Forgetting balances
* Judges like problems with clear financial waste

### Real-world example

* In the US alone, unused gift cards = billions of dollars in breakage
* People receive Amazon / store cards but don't shop there → money stuck

---

## ✅ Solution (Arbitrum Ecosystem)

"On-chain gift cards built with **Rust + Stylus** that lock funds and let recipients spend flexibly."

### Why Arbitrum + Stylus?

* **10x cheaper gas fees** than Ethereum L1
* **Stylus contracts** (Rust → WASM) = better performance & memory efficiency
* **Developer-friendly SDK** for easy integration
* **Real-time analytics dashboard** for transparency
* Smart contracts:
  * Lock funds securely
  * Track balance transparently
  * Auto-refund unused money
* Flexible spending = less waste
* This is not forced Web3 — blockchain adds real value

### Arbitrum Hackathon Categories

This project targets **3 categories**:

1. ✅ **Stylus-based contracts and tools** - Core contracts in Rust
2. ✅ **Dashboards, SDKs, developer tools** - Developer SDK + Analytics
3. ✅ **Orbit chain experiments** (Optional) - Custom L3 deployment

---

# 👤 USER FLOW (Step-by-Step)

## 🎁 Flow 1: Gift Giver (Creates Gift Card)

1. User opens the web app
   → clicks **"Create Gift Card"**

2. Connects wallet (MetaMask to Arbitrum)

3. Enters:

   * Amount: `50 USDC`
   * Expiry / refund date: `30 days`
   * Allowed merchants: `Uber, Zomato, Amazon`
   * Optional message: *"Happy Birthday 🎉"*

4. Clicks **Create**

   * Transaction sent to Stylus contract
   * USDC locked in smart contract

✅ **Result:**
A digital gift card link is generated and shared with the recipient.

---

## 👤 Flow 2: Gift Receiver (Uses Gift Card)

1. Recipient opens the gift card link

2. Sees:

   * Gift amount: `50 USDC`
   * Remaining balance: `50 USDC`
   * Allowed merchants
   * Expiry countdown

3. Selects a merchant (e.g., Uber)

4. Spends `10 USDC`

   * Stylus contract releases funds
   * Balance updates automatically

✅ **Result:**
Remaining balance = `40 USDC`

---

## 🔁 Flow 3: Refund (Unused Balance)

1. Expiry date is reached
2. Contract checks remaining balance
3. Automatically allows refund
4. Gift giver claims unused amount

✅ **Result:**
Unused funds go back to the gift giver
→ **No money wasted**

---

# 📄 PRD (Product Requirement Document)

## 1️⃣ Product Overview

**Product Name:** FlexiGift (Arbitrum Ecosystem)

**Goal:** Reduce gift card waste using Rust + Stylus smart contracts with developer tools and analytics.

---

## 2️⃣ Problem Statement

Over **20% of gift cards go unused** due to brand restrictions and expiry, wasting billions of dollars annually.

---

## 3️⃣ Solution

A blockchain-based gift card system where funds are:

* Locked in Stylus smart contracts (Rust → WASM)
* Spent across multiple merchants
* Automatically refundable if unused
* Supported by developer SDK and analytics dashboard

---

## 4️⃣ Target Users

* Gift givers (friends, family)
* Gift recipients
* Developers (using FlexiGift SDK)
* Merchants (future scope)

---

## 5️⃣ Key Features (MVP)

### 🎁 Gift Creation

* Create gift card with USDC
* Set expiry / refund date
* Choose allowed merchants
* Powered by Stylus contracts

### 💳 Gift Redemption

* View balance in real-time
* Spend partially
* Multi-merchant support

### 🔄 Refund Logic

* Auto-refund unused balance after expiry
* Trustless (smart contract based)

### 🛠️ Developer Tools

* **FlexiGift SDK**: TypeScript/JavaScript library
* **Analytics Dashboard**: Real-time on-chain metrics
* **Documentation**: Stylus development tutorials

---

## 6️⃣ Functional Requirements

| Feature          | Description                    |
| ---------------- | ------------------------------ |
| Wallet Login     | MetaMask connect (Arbitrum)    |
| Create Gift      | Lock USDC in Stylus contract   |
| Redeem Gift      | Release funds on spend         |
| Balance Tracking | Live updates                   |
| Refund           | Claim after expiry             |
| SDK Integration  | Easy developer integration     |
| Analytics        | Real-time dashboard            |

---

## 7️⃣ Non-Functional Requirements

* **Low gas fees** (Arbitrum L2)
* **Secure Stylus contracts** (Rust safety guarantees)
* **Simple UI** (non-crypto users)
* **Developer-friendly** (comprehensive SDK)
* **Performance** (WASM execution efficiency)

---

## 8️⃣ Tech Stack (Arbitrum Ecosystem)

### Core Infrastructure
* **Blockchain:** Arbitrum Sepolia (Testnet) / Arbitrum One (Mainnet)
* **Smart Contracts:** **Rust + Stylus SDK** (compiles to WASM)
* **Token:** USDC (ERC-20)
* **Deployment:** `cargo stylus` CLI

### Developer Tools & SDK
* **FlexiGift SDK:** TypeScript/JavaScript library for easy integration
* **Analytics Dashboard:** Real-time on-chain metrics and insights
* **Documentation:** Technical tutorials on Stylus development

### Frontend & Integration
* **Frontend:** Next.js + React
* **Wallet:** MetaMask (Arbitrum network)
* **Web3 Library:** ethers.js v6
* **Storage (optional):** IPFS for metadata

### Advanced (Optional)
* **Orbit Chain:** Custom L3 deployment for dedicated throughput
* **Custom Gas Token:** GIFT token for ecosystem fees

---

## 9️⃣ Success Metrics

* % of gift cards fully used
* Reduction in unused balances
* Successful refund transactions
* **SDK adoption** (number of integrations)
* **Gas savings** vs. Ethereum L1
* **Developer engagement** (tutorial views, SDK downloads)

---

## 🔟 Out of Scope (Hackathon)

* Merchant onboarding
* KYC
* Fiat on-ramp
* Mobile apps

---

# 🏆 One-Line Pitch (For Judges)

> "We reduce gift card waste using **Rust + Stylus smart contracts** on Arbitrum, with a developer SDK and analytics dashboard that makes on-chain gift cards 10x cheaper and fully transparent."

---

# 🎯 Arbitrum Ecosystem Benefits

## Why Stylus?
* **Performance**: Rust compiles to WASM = faster execution
* **Cost**: Lower memory usage = cheaper gas fees
* **Developer Experience**: Modern language with better tooling
* **Interoperability**: Full compatibility with Solidity contracts

## Why Developer Tools?
* **FlexiGift SDK**: Easy integration for any dApp
* **Analytics Dashboard**: Real-time insights into gift card economy
* **Technical Tutorials**: Help others build on Arbitrum Stylus

## Why Orbit (Optional)?
* **Dedicated Throughput**: Custom L3 for gift card transactions
* **Custom Economics**: GIFT token as gas token
* **Lower Costs**: Even cheaper than Arbitrum L2

---

# 🚀 Hackathon Deliverables

1. **Stylus Smart Contracts** (Rust)
   - GiftCard.rs
   - MerchantRegistry.rs
   - Comprehensive tests

2. **Developer SDK** (TypeScript)
   - npm package
   - Full API documentation
   - Code examples

3. **Analytics Dashboard** (Next.js)
   - Real-time metrics
   - Gas savings calculator
   - Redemption analytics

4. **Frontend Application** (Next.js)
   - Create gift cards
   - Redeem & track balances
   - Arbitrum integration

5. **Documentation**
   - Stylus development guide
   - SDK integration tutorial
   - Video walkthrough
