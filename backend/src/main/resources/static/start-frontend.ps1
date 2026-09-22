Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Event Planning System Frontend (Port 3000)" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Set-Location $PSScriptRoot
py -m http.server 3000
