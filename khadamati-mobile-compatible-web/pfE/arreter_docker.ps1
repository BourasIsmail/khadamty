# Script d'arrêt Docker pour Khadamati
# Auteur: Assistant Kiro
# Date: 2026-05-11

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   KHADAMATI - Arrêt Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🛑 Arrêt des conteneurs..." -ForegroundColor Yellow
docker-compose down

Write-Host ""
Write-Host "✅ Tous les conteneurs ont été arrêtés" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Les données MySQL sont conservées dans le volume Docker" -ForegroundColor Gray
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
