# Setup script to replace YOUR_USERNAME with your actual GitHub username

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

Write-Host "Setting up plugin for GitHub user: $GitHubUsername" -ForegroundColor Green

# Replace in manifest.json
$content = Get-Content "manifest.json" -Raw
$content = $content -replace "YOUR_USERNAME", $GitHubUsername
Set-Content "manifest.json" -Value $content

# Replace in README.md
$content = Get-Content "README.md" -Raw
$content = $content -replace "yourusername", $GitHubUsername
Set-Content "README.md" -Value $content

Write-Host "✅ Updated all files with username: $GitHubUsername" -ForegroundColor Green
Write-Host "Next: Create your GitHub repository and push the code!" -ForegroundColor Yellow
