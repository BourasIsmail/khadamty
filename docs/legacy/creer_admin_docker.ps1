# Script pour créer le compte admin dans Docker MySQL
# Auteur: Assistant Kiro
# Date: 2026-05-11

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Création du compte admin" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📧 Email: ismailelrhazoui21@gmail.com" -ForegroundColor Yellow
Write-Host "🔑 Mot de passe: smail1234" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔄 Connexion à MySQL Docker..." -ForegroundColor Yellow

# Exécuter le script SQL dans le conteneur MySQL
docker exec -i khadamati-mysql mysql -uroot -p2003 khadamati_db < creer_admin_docker.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Compte admin créé avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📌 Vous pouvez maintenant vous connecter avec :" -ForegroundColor Yellow
    Write-Host "   Email: ismailelrhazoui21@gmail.com" -ForegroundColor White
    Write-Host "   Mot de passe: smail1234" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors de la création du compte" -ForegroundColor Red
    Write-Host "📌 Vérifiez que Docker est en cours d'exécution" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
