# Script de connexion rapide à MySQL
# Usage: .\mysql-connect.ps1

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔌 Connexion à MySQL (Khadamati)    " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Base de données : khadamati_db" -ForegroundColor Yellow
Write-Host "👤 Utilisateur     : root" -ForegroundColor Yellow
Write-Host "🔑 Mot de passe    : 2003" -ForegroundColor Yellow
Write-Host "🔌 Port            : 3307" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Commandes utiles une fois connecté :" -ForegroundColor Green
Write-Host "   SHOW TABLES;                  - Voir toutes les tables" -ForegroundColor Gray
Write-Host "   SELECT * FROM users;          - Voir les utilisateurs" -ForegroundColor Gray
Write-Host "   SELECT * FROM employees;      - Voir les employés" -ForegroundColor Gray
Write-Host "   DESCRIBE users;               - Structure de la table users" -ForegroundColor Gray
Write-Host "   EXIT;                         - Quitter MySQL" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Connexion en cours..." -ForegroundColor Cyan
Write-Host ""

docker exec -it khadamati-mysql mysql -u root -p2003 khadamati_db
