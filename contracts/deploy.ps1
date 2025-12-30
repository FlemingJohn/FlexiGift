# FlexiGift Stylus Contract Deployment Script (PowerShell)
# Deploy to Arbitrum Sepolia Testnet

param(
    [Parameter(Mandatory=$true)]
    [string]$PrivateKey
)

Write-Host "🚀 FlexiGift Stylus Deployment Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$Endpoint = "https://sepolia-rollup.arbitrum.io/rpc"
$UsdcAddress = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" # Arbitrum Sepolia USDC

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Network: Arbitrum Sepolia"
Write-Host "  Endpoint: $Endpoint"
Write-Host "  USDC Address: $UsdcAddress"
Write-Host ""

# Step 1: Build the contract
Write-Host "🔨 Building contract..." -ForegroundColor Yellow
cargo build --release
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build complete" -ForegroundColor Green
Write-Host ""

# Step 2: Check contract validity
Write-Host "🔍 Checking contract validity..." -ForegroundColor Yellow
cargo stylus check --endpoint $Endpoint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Contract validation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Contract is valid" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy contract
Write-Host "🚀 Deploying contract..." -ForegroundColor Yellow
Write-Host "Note: This will send TWO transactions:" -ForegroundColor Cyan
Write-Host "  1. Contract deployment (upload WASM)"
Write-Host "  2. Contract activation (compile to native code)"
Write-Host ""

$DeployOutput = cargo stylus deploy --private-key $PrivateKey --endpoint $Endpoint 2>&1 | Out-String

Write-Host $DeployOutput

# Extract contract address
if ($DeployOutput -match "deployed code at address: (0x[a-fA-F0-9]{40})") {
    $ContractAddress = $Matches[1]
} else {
    Write-Host "❌ Failed to extract contract address" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host "📝 Contract Address: $ContractAddress" -ForegroundColor Cyan
Write-Host ""

# Step 4: Export ABI
Write-Host "📄 Exporting ABI..." -ForegroundColor Yellow
$AbiPath = "..\frontend\src\contracts"
if (!(Test-Path $AbiPath)) {
    New-Item -ItemType Directory -Path $AbiPath -Force | Out-Null
}
cargo stylus export-abi | Out-File -FilePath "$AbiPath\FlexiGift.json" -Encoding UTF8
Write-Host "✅ ABI exported to frontend/src/contracts/FlexiGift.json" -ForegroundColor Green
Write-Host ""

# Save deployment info
Write-Host "💾 Saving deployment info..." -ForegroundColor Yellow
$ReactivationDate = (Get-Date).AddDays(365).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$DeploymentInfo = @{
    network = "arbitrum-sepolia"
    contractAddress = $ContractAddress
    usdcAddress = $UsdcAddress
    deployedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    endpoint = $Endpoint
    chainId = 421614
    reactivationRequired = $ReactivationDate
} | ConvertTo-Json

$DeploymentInfo | Out-File -FilePath "deployment.json" -Encoding UTF8

Write-Host "✅ Deployment info saved to deployment.json" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Contract must be reactivated:" -ForegroundColor Yellow
Write-Host "   - Once per year (365 days)"
Write-Host "   - After any Stylus upgrade"
Write-Host ""
Write-Host "To reactivate:" -ForegroundColor Cyan
Write-Host "  cargo stylus activate \"
Write-Host "    --address $ContractAddress \"
Write-Host "    --endpoint $Endpoint \"
Write-Host "    --private-key `$PrivateKey"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify contract on Arbiscan: https://sepolia.arbiscan.io/address/$ContractAddress"
Write-Host "2. Initialize contract with USDC address"
Write-Host "3. Update frontend with contract address"
Write-Host ""
