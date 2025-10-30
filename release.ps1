# MilkDrop Visualizer Release Script
# Run this to create a new release with proper checksums

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,

    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

Write-Host "Creating release v$Version for user $GitHubUsername" -ForegroundColor Green

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Create release directory
$releaseDir = "release-v$Version"
New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null

# Copy necessary files
Copy-Item "dist/jellyfin-plugin-milkdropvisualizer.js" -Destination "$releaseDir/"
Copy-Item "manifest.json" -Destination "$releaseDir/"

# Generate checksum
$checksum = Get-FileHash -Algorithm SHA256 "$releaseDir/jellyfin-plugin-milkdropvisualizer.js" | Select-Object -ExpandProperty Hash

Write-Host "SHA256 Checksum: $checksum" -ForegroundColor Cyan

# Create zip file
Compress-Archive -Path "$releaseDir/*" -DestinationPath "$releaseDir/jellyfin-plugin-milkdropvisualizer.zip" -Force

# Update manifest with actual checksum and username
$manifestPath = "$releaseDir/manifest.json"
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json

# Update GitHub URLs
$manifest.description = $manifest.description -replace "trebor048", $GitHubUsername
$manifest.imageUrl = $manifest.imageUrl -replace "trebor048", $GitHubUsername

# Update version info
foreach ($ver in $manifest.versions) {
    if ($ver.version -eq $Version) {
        $ver.checksum = $checksum.ToUpper()
        $ver.timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        $ver.sourceUrl = $ver.sourceUrl -replace "trebor048", $GitHubUsername
        $ver.changelog = $ver.changelog -replace "trebor048", $GitHubUsername
    }
}

# Save updated manifest
$manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath

Write-Host "Release created in: $releaseDir" -ForegroundColor Green
Write-Host "Files ready for GitHub release:" -ForegroundColor Yellow
Get-ChildItem $releaseDir

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create a new release on GitHub: https://github.com/$GitHubUsername/MilkDropVisualizer/releases/new"
Write-Host "2. Set tag to: v$Version"
Write-Host "3. Upload: $releaseDir/jellyfin-plugin-milkdropvisualizer.zip"
Write-Host "4. Copy checksum for verification: $checksum"
Write-Host "5. Update the repository manifest.json with this version info"
