# Script PowerShell pour créer des comptes de test
# Projet Khadamati

Write-Host "🚀 Création des comptes de test pour Khadamati" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:8080/api/auth/register"

# Compte ADMIN
Write-Host "1️⃣  Création du compte ADMIN..." -ForegroundColor Yellow
$adminData = @{
    email = "admin@khadamati.com"
    password = "Admin123!"
    firstName = "Admin"
    lastName = "Système"
    phone = "0612345678"
    department = "Administration"
    position = "Administrateur Système"
    hireDate = "2024-01-01"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $adminData -ContentType "application/json"
    Write-Host "✅ Compte ADMIN créé : $($response.employeeId)" -ForegroundColor Green
    Write-Host "   Email: admin@khadamati.com" -ForegroundColor Gray
    Write-Host "   Mot de passe: Admin123!" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur lors de la création du compte ADMIN" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Compte RH
Write-Host "2️⃣  Création du compte RH..." -ForegroundColor Yellow
$rhData = @{
    email = "rh@khadamati.com"
    password = "Rh123456!"
    firstName = "Responsable"
    lastName = "RH"
    phone = "0623456789"
    department = "Ressources Humaines"
    position = "Responsable RH"
    hireDate = "2024-01-15"
    role = "RH"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $rhData -ContentType "application/json"
    Write-Host "✅ Compte RH créé : $($response.employeeId)" -ForegroundColor Green
    Write-Host "   Email: rh@khadamati.com" -ForegroundColor Gray
    Write-Host "   Mot de passe: Rh123456!" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur lors de la création du compte RH" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Compte EMPLOYEE
Write-Host "3️⃣  Création du compte EMPLOYEE..." -ForegroundColor Yellow
$employeeData = @{
    email = "employee@khadamati.com"
    password = "Employee123!"
    firstName = "Employé"
    lastName = "Test"
    phone = "0634567890"
    department = "Développement"
    position = "Développeur"
    hireDate = "2024-02-01"
    role = "EMPLOYEE"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $employeeData -ContentType "application/json"
    Write-Host "✅ Compte EMPLOYEE créé : $($response.employeeId)" -ForegroundColor Green
    Write-Host "   Email: employee@khadamati.com" -ForegroundColor Gray
    Write-Host "   Mot de passe: Employee123!" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur lors de la création du compte EMPLOYEE" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Création des comptes terminée !" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Résumé des comptes créés :" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "| Rôle     | Email                    | Mot de passe    |" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "| ADMIN    | admin@khadamati.com      | Admin123!       |" -ForegroundColor Green
Write-Host "| RH       | rh@khadamati.com         | Rh123456!       |" -ForegroundColor Blue
Write-Host "| EMPLOYEE | employee@khadamati.com   | Employee123!    |" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Vous pouvez maintenant vous connecter sur http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
