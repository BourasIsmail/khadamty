# Script de démarrage Docker pour Khadamati
# Auteur: Assistant Kiro
# Date: 2026-05-11

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   KHADAMATI - Démarrage Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker Desktop est en cours d'exécution
Write-Host "🔍 Vérification de Docker Desktop..." -ForegroundColor Yellow
$dockerProcess = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue

if (-not $dockerProcess) {
    Write-Host "❌ Docker Desktop n'est pas en cours d'exécution!" -ForegroundColor Red
    Write-Host "📌 Veuillez démarrer Docker Desktop et réessayer." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host "✅ Docker Desktop est en cours d'exécution" -ForegroundColor Green
Write-Host ""

# Arrêter les conteneurs existants
Write-Host "🛑 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose down 2>$null

Write-Host ""
Write-Host "🚀 Démarrage des services Docker..." -ForegroundColor Yellow
Write-Host "   - MySQL (port 3307)" -ForegroundColor Gray
Write-Host "   - Backend Spring Boot (port 8081)" -ForegroundColor Gray
Write-Host "   - Frontend Next.js (port 3001)" -ForegroundColor Gray
Write-Host ""

# Démarrer les services
docker-compose up --build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Services arrêtés" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
