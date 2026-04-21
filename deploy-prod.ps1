# Production Deployment Script for Windows
# Usage: .\deploy-prod.ps1 -Environment local
# or:    .\deploy-prod.ps1 -Environment ovh

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('local', 'ovh')]
    [string]$Environment = 'local'
)

Write-Host "[DEPLOY] Starting Portfolio deployment in $Environment production mode..." -ForegroundColor Green

# Determine environment file
$envFile = if ($Environment -eq 'local') {
    "backend\.env.production.local"
} else {
    "backend\.env.production.ovh"
}

# Check if environment file exists
if (-not (Test-Path $envFile)) {
    Write-Host "[ERROR] File not found: $envFile" -ForegroundColor Red
    Write-Host "Please create the environment file first." -ForegroundColor Yellow
    exit 1
}

Write-Host "[CONFIG] Using environment file: $envFile" -ForegroundColor Cyan

# Load environment variables
Get-Content $envFile | Where-Object {$_ -match '^\w+' -and $_ -notmatch '^#'} | ForEach-Object {
    $name, $value = $_.Split('=', 2)
    if ($name -and $value) {
        [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
    }
}

$ErrorActionPreference = "Stop"

# Stop existing containers
Write-Host "[STOP] Stopping existing containers..." -ForegroundColor Yellow
$ErrorActionPreference = "Continue"
docker-compose -f docker-compose.prod.yml down *>&1 | Where-Object { $_ -notmatch "warning|Stopping" } | ForEach-Object { if ($_) { Write-Host $_ } }
$ErrorActionPreference = "Stop"

# Build and start
Write-Host "[BUILD] Building Docker images..." -ForegroundColor Yellow
$ErrorActionPreference = "Continue"
docker-compose -f docker-compose.prod.yml up --build -d
$ErrorActionPreference = "Stop"

# Wait for services
Write-Host "[WAIT] Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$ErrorActionPreference = "Stop"

# Health check
Write-Host "[CHECK] Checking service health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response -and $response.StatusCode -eq 200) {
        Write-Host "[OK] Backend is healthy!" -ForegroundColor Green
    } else {
        Write-Host "[FAILED] Backend health check failed" -ForegroundColor Red
        docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    }
} catch {
    Write-Host "[FAILED] Backend health check failed: $_" -ForegroundColor Red
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
}

# Show status
Write-Host ""
Write-Host "[SUCCESS] Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "[SERVICES] Running services:" -ForegroundColor Cyan
Write-Host "  - Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Health:   http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "[COMMANDS] Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:      docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Gray
Write-Host "  Stop services:  docker-compose -f docker-compose.prod.yml down" -ForegroundColor Gray
Write-Host "  Restart:        docker-compose -f docker-compose.prod.yml restart" -ForegroundColor Gray
Write-Host ""
