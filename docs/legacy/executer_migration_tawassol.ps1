# Script d'exécution de la migration Tawassol
# Ce script ajoute les nouvelles fonctionnalités à la base Khadamati existante

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 MIGRATION TAWASSOL - Ajout des Fonctionnalités       " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Configuration
$DB_NAME = "khadamati_db"
$DB_USER = "root"
$DB_PASSWORD = "2003"
$DB_PORT = "3307"
$MIGRATION_FILE = "database/ajout_fonctionnalites_tawassol.sql"

Write-Host "📊 Configuration :" -ForegroundColor Yellow
Write-Host "   Base de données : $DB_NAME" -ForegroundColor Gray
Write-Host "   Utilisateur     : $DB_USER" -ForegroundColor Gray
Write-Host "   Port            : $DB_PORT" -ForegroundColor Gray
Write-Host "   Fichier SQL     : $MIGRATION_FILE" -ForegroundColor Gray
Write-Host ""

# Vérifier que Docker est en cours d'exécution
Write-Host "🔍 Vérification de Docker..." -ForegroundColor Cyan
$dockerStatus = docker ps -q -f name=khadamati-mysql
if (-not $dockerStatus) {
    Write-Host "❌ ERREUR : Le conteneur MySQL n'est pas en cours d'exécution !" -ForegroundColor Red
    Write-Host "   Lancez d'abord : .\demarrer_docker.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Docker MySQL est actif" -ForegroundColor Green
Write-Host ""

# Sauvegarder la base de données actuelle
Write-Host "💾 Sauvegarde de la base de données actuelle..." -ForegroundColor Cyan
$BACKUP_FILE = "backup_khadamati_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
docker exec khadamati-mysql mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Sauvegarde créée : $BACKUP_FILE" -ForegroundColor Green
} else {
    Write-Host "⚠️  Impossible de créer la sauvegarde (continuez quand même ?)" -ForegroundColor Yellow
    $response = Read-Host "Continuer sans sauvegarde ? (o/N)"
    if ($response -ne "o" -and $response -ne "O") {
        Write-Host "❌ Migration annulée" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Afficher un résumé des changements
Write-Host "📋 Résumé des modifications à apporter :" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ✨ NOUVELLES TABLES (18) :" -ForegroundColor Yellow
Write-Host "      • coordination_region (12 régions du Maroc)" -ForegroundColor Gray
Write-Host "      • delegation_province (délégations)" -ForegroundColor Gray
Write-Host "      • structure (hiérarchie organisationnelle)" -ForegroundColor Gray
Write-Host "      • grade (échelles et échelons)" -ForegroundColor Gray
Write-Host "      • examen_grade (concours internes)" -ForegroundColor Gray
Write-Host "      • salaire (salaires mensuels)" -ForegroundColor Gray
Write-Host "      • prime (primes et gratifications)" -ForegroundColor Gray
Write-Host "      • credit (crédits bancaires)" -ForegroundColor Gray
Write-Host "      • programme_mission (catégories)" -ForegroundColor Gray
Write-Host "      • moyen_transport (moyens de transport)" -ForegroundColor Gray
Write-Host "      • ordre_mission (ordres de mission)" -ForegroundColor Gray
Write-Host "      • type_demande (types de demandes)" -ForegroundColor Gray
Write-Host "      • demande (demandes unifiées)" -ForegroundColor Gray
Write-Host "      • piece_jointe (pièces jointes)" -ForegroundColor Gray
Write-Host "      • type_document (types de documents)" -ForegroundColor Gray
Write-Host "      • document (documents publiés)" -ForegroundColor Gray
Write-Host "      • annonce (annonces internes)" -ForegroundColor Gray
Write-Host "      • reclamation (réclamations)" -ForegroundColor Gray
Write-Host "      • note_annuelle (évaluations)" -ForegroundColor Gray
Write-Host ""
Write-Host "   🔄 TABLES MODIFIÉES (1) :" -ForegroundColor Yellow
Write-Host "      • employees (ajout de colonnes : grade_id, structure_id, matricule, etc.)" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✅ TABLES CONSERVÉES (5) :" -ForegroundColor Green
Write-Host "      • users (inchangée)" -ForegroundColor Gray
Write-Host "      • employees (étendue)" -ForegroundColor Gray
Write-Host "      • attendances (inchangée)" -ForegroundColor Gray
Write-Host "      • leave_requests (inchangée)" -ForegroundColor Gray
Write-Host "      • document_requests (inchangée)" -ForegroundColor Gray
Write-Host ""

# Demander confirmation
Write-Host "⚠️  ATTENTION : Cette opération va modifier votre base de données !" -ForegroundColor Yellow
$confirmation = Read-Host "Voulez-vous continuer ? (o/N)"
if ($confirmation -ne "o" -and $confirmation -ne "O") {
    Write-Host "❌ Migration annulée" -ForegroundColor Red
    exit 0
}
Write-Host ""

# Exécuter la migration
Write-Host "🚀 Exécution de la migration..." -ForegroundColor Cyan
Write-Host ""

# Copier le fichier SQL dans le conteneur
docker cp $MIGRATION_FILE khadamati-mysql:/tmp/migration.sql

# Exécuter le script SQL
docker exec -i khadamati-mysql mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $MIGRATION_FILE

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ MIGRATION RÉUSSIE !                                   " -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Vérification des données insérées :" -ForegroundColor Cyan
    Write-Host ""
    
    # Vérifier les données
    docker exec khadamati-mysql mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) AS nb_coordinations FROM coordination_region;"
    docker exec khadamati-mysql mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) AS nb_types_demandes FROM type_demande;"
    docker exec khadamati-mysql mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) AS nb_types_documents FROM type_document;"
    docker exec khadamati-mysql mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) AS nb_moyens_transport FROM moyen_transport;"
    docker exec khadamati-mysql mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) AS nb_grades FROM grade;"
    
    Write-Host ""
    Write-Host "🎉 La base de données Khadamati a été étendue avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "   1. Créer les entités JPA dans le backend Spring Boot" -ForegroundColor Gray
    Write-Host "   2. Créer les repositories" -ForegroundColor Gray
    Write-Host "   3. Créer les services" -ForegroundColor Gray
    Write-Host "   4. Créer les controllers REST" -ForegroundColor Gray
    Write-Host "   5. Créer les pages frontend" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💾 Sauvegarde disponible : $BACKUP_FILE" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ❌ ERREUR LORS DE LA MIGRATION                          " -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "💾 Vous pouvez restaurer la sauvegarde avec :" -ForegroundColor Yellow
    Write-Host "   docker exec -i khadamati-mysql mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $BACKUP_FILE" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
