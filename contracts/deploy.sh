#!/bin/bash

# FlexiGift Stylus Contract Deployment Script
# Deploy to Arbitrum Sepolia Testnet

set -e

echo "🚀 FlexiGift Stylus Deployment Script"
echo "======================================"

# Check if private key is provided
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    echo "Usage: PRIVATE_KEY=your_key ./deploy.sh"
    exit 1
fi

# Configuration
ENDPOINT="https://sepolia-rollup.arbitrum.io/rpc"
USDC_ADDRESS="0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" # Arbitrum Sepolia USDC

echo ""
echo "📋 Configuration:"
echo "  Network: Arbitrum Sepolia"
echo "  Endpoint: $ENDPOINT"
echo "  USDC Address: $USDC_ADDRESS"
echo ""

# Step 1: Build the contract
echo "🔨 Building contract..."
cargo build --release
echo "✅ Build complete"
echo ""

# Step 2: Check contract validity
echo "🔍 Checking contract validity..."
cargo stylus check --endpoint $ENDPOINT
echo "✅ Contract is valid"
echo ""

# Step 3: Deploy contract
echo "🚀 Deploying contract..."
echo "Note: This will send TWO transactions:"
echo "  1. Contract deployment (upload WASM)"
echo "  2. Contract activation (compile to native code)"
echo ""

DEPLOY_OUTPUT=$(cargo stylus deploy \
    --private-key $PRIVATE_KEY \
    --endpoint $ENDPOINT \
    2>&1)

echo "$DEPLOY_OUTPUT"

# Extract contract address from output
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'deployed code at address: \K0x[a-fA-F0-9]{40}' || echo "")

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Failed to extract contract address"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo "📝 Contract Address: $CONTRACT_ADDRESS"
echo ""

# Step 4: Export ABI
echo "📄 Exporting ABI..."
mkdir -p ../frontend/src/contracts
cargo stylus export-abi > ../frontend/src/contracts/FlexiGift.json
echo "✅ ABI exported to frontend/src/contracts/FlexiGift.json"
echo ""

# Save deployment info
echo "💾 Saving deployment info..."
cat > deployment.json <<EOF
{
  "network": "arbitrum-sepolia",
  "contractAddress": "$CONTRACT_ADDRESS",
  "usdcAddress": "$USDC_ADDRESS",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "endpoint": "$ENDPOINT",
  "chainId": 421614,
  "reactivationRequired": "$(date -u -d '+365 days' +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "✅ Deployment info saved to deployment.json"
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Contract must be reactivated:"
echo "   - Once per year (365 days)"
echo "   - After any Stylus upgrade"
echo ""
echo "To reactivate:"
echo "  cargo stylus activate \\"
echo "    --address $CONTRACT_ADDRESS \\"
echo "    --endpoint $ENDPOINT \\"
echo "    --private-key \$PRIVATE_KEY"
echo ""
echo "Next steps:"
echo "1. Verify contract on Arbiscan: https://sepolia.arbiscan.io/address/$CONTRACT_ADDRESS"
echo "2. Initialize contract with USDC address"
echo "3. Update frontend with contract address"
echo ""
