# Script de nettoyage Docker pour Khadamati
# Auteur: Assistant Kiro
# Date: 2026-05-11

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   KHADAMATI - Nettoyage Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Arrêter tous les conteneurs
Write-Host "🛑 Arrêt de tous les conteneurs..." -ForegroundColor Yellow
docker-compose down 2>$null

Write-Host ""
Write-Host "🧹 Nettoyage des anciennes images..." -ForegroundColor Yellow

# Supprimer les images du projet
docker rmi pfe-backend -f 2>$null
docker rmi pfe-frontend -f 2>$null
docker rmi khadamati-backend -f 2>$null
docker rmi khadamati-frontend -f 2>$null

# Nettoyer les images non utilisées
docker image prune -f 2>$null

Write-Host ""
Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Vous pouvez maintenant démarrer Docker avec :" -ForegroundColor Yellow
Write-Host "   docker-compose up --build" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
