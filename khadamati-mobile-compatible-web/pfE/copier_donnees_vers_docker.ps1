# Script pour copier les données MySQL local vers Docker
# Auteur: Assistant Kiro
# Date: 2026-05-11

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Copie des données vers Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Docker est en cours d'exécution
Write-Host "🔍 Vérification de Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if (-not $dockerRunning) {
    Write-Host "❌ Docker n'est pas en cours d'exécution !" -ForegroundColor Red
    Write-Host "📌 Démarrez Docker avec: docker-compose up -d" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host "✅ Docker est en cours d'exécution" -ForegroundColor Green
Write-Host ""

# Étape 1 : Exporter la base de données locale
Write-Host "📦 Étape 1/3 : Export de la base de données locale..." -ForegroundColor Yellow
Write-Host "   Port: 3306 (MySQL local)" -ForegroundColor Gray

mysqldump -u root -p2003 -h localhost -P 3306 khadamati_db > backup_local.sql 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Export réussi : backup_local.sql" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'export" -ForegroundColor Red
    Write-Host "📌 Vérifiez que MySQL local est démarré sur le port 3306" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""

# Étape 2 : Vider la base Docker (optionnel)
Write-Host "🗑️  Étape 2/3 : Nettoyage de la base Docker..." -ForegroundColor Yellow
Write-Host "   Port: 3307 (MySQL Docker)" -ForegroundColor Gray

docker exec -i khadamati-mysql mysql -uroot -p2003 -e "DROP DATABASE IF EXISTS khadamati_db; CREATE DATABASE khadamati_db;" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Base Docker nettoyée" -ForegroundColor Green
} else {
    Write-Host "⚠️  Avertissement : Impossible de nettoyer la base Docker" -ForegroundColor Yellow
}

Write-Host ""

# Étape 3 : Importer dans Docker
Write-Host "📥 Étape 3/3 : Import dans Docker..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre quelques secondes..." -ForegroundColor Gray

docker exec -i khadamati-mysql mysql -uroot -p2003 khadamati_db < backup_local.sql 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Import réussi !" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   ✅ Copie terminée avec succès !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📌 Vos données sont maintenant dans Docker" -ForegroundColor Yellow
    Write-Host "📌 Vous pouvez vous connecter avec vos comptes habituels" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🌐 Ouvrez: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "📧 Email: ismailelrhazoui21@gmail.com" -ForegroundColor White
    Write-Host "🔑 Mot de passe: smail1234" -ForegroundColor White
} else {
    Write-Host "❌ Erreur lors de l'import" -ForegroundColor Red
    Write-Host "📌 Vérifiez que le conteneur MySQL Docker est démarré" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Note: Le fichier backup_local.sql a été créé" -ForegroundColor Gray
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
