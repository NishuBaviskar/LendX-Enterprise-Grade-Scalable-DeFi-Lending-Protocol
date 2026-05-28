# LendX Enterprise Permanent Sync
Write-Host "🔄 Syncing ABIs..." -ForegroundColor Cyan
Copy-Item "blockchain/build/contracts/*.json" "frontend/src/abis/" -Force


# Automatically find the Network ID from the first compiled contract
$sampleJson = Get-Content "blockchain/build/contracts/AccessControlManager.json" | ConvertFrom-Json
$networkId = ($sampleJson.networks.psobject.properties.name)[0]

Write-Host "📡 Detected Network ID: $networkId" -ForegroundColor Yellow

$contracts = @{
    "VITE_LENDING_POOL_ADDRESS"      = "ERC1967Proxy"
    "VITE_ROLLUP_BATCHER_ADDRESS"    = "RollupBatcher"
    "VITE_BRIDGE_ADDRESS"            = "Bridge"
    "VITE_DAO_ADDRESS"               = "DAOUpgradeable"
    "VITE_FLASH_PROTECTION_ADDRESS"  = "FlashLoanProtection"
}

function Update-Env($path, $isVite) {
    if (Test-Path $path) {
        $lines = Get-Content $path
        foreach ($var in $contracts.Keys) {
            $json = Get-Content "blockchain/build/contracts/$($contracts[$var]).json" | ConvertFrom-Json
            $addr = $json.networks."$networkId".address
            
            $targetVar = if ($isVite) { $var } else { $var -replace "VITE_", "" }
            $lines = $lines -replace "$targetVar=.*", "$targetVar=$addr"
        }
        $lines | Set-Content $path
    }
}

Update-Env "frontend/.env" $true
Update-Env "backend/.env" $false

Write-Host "✅ Environments Synced Permanently!" -ForegroundColor Green