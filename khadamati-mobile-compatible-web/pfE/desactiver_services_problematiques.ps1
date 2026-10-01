# Script pour désactiver temporairement les services et contrôleurs problématiques
# Cela permettra au backend de compiler

$services = @(
    "spring-backend/src/main/java/com/employeehub/service/SalaireService.java",
    "spring-backend/src/main/java/com/employeehub/service/PrimeService.java",
    "spring-backend/src/main/java/com/employeehub/service/DelegationProvinceService.java",
    "spring-backend/src/main/java/com/employeehub/service/CoordinationRegionService.java",
    "spring-backend/src/main/java/com/employeehub/service/TypeDemandeService.java",
    "spring-backend/src/main/java/com/employeehub/service/NoteAnnuelleService.java",
    "spring-backend/src/main/java/com/employeehub/service/MoyenTransportService.java",
    "spring-backend/src/main/java/com/employeehub/service/TypeDocumentService.java",
    "spring-backend/src/main/java/com/employeehub/service/GradeService.java",
    "spring-backend/src/main/java/com/employeehub/service/ExamenGradeService.java",
    "spring-backend/src/main/java/com/employeehub/service/CreditService.java"
)

$controllers = @(
    "spring-backend/src/main/java/com/employeehub/controller/SalaireController.java",
    "spring-backend/src/main/java/com/employeehub/controller/PrimeController.java",
    "spring-backend/src/main/java/com/employeehub/controller/DelegationProvinceController.java",
    "spring-backend/src/main/java/com/employeehub/controller/CoordinationRegionController.java",
    "spring-backend/src/main/java/com/employeehub/controller/TypeDemandeController.java",
    "spring-backend/src/main/java/com/employeehub/controller/NoteAnnuelleController.java",
    "spring-backend/src/main/java/com/employeehub/controller/MoyenTransportController.java",
    "spring-backend/src/main/java/com/employeehub/controller/TypeDocumentController.java",
    "spring-backend/src/main/java/com/employeehub/controller/GradeController.java",
    "spring-backend/src/main/java/com/employeehub/controller/ExamenGradeController.java",
    "spring-backend/src/main/java/com/employeehub/controller/CreditController.java"
)

Write-Host "Désactivation des services problématiques..." -ForegroundColor Yellow

foreach ($file in $services) {
    if (Test-Path $file) {
        $newName = $file -replace "\.java$", ".java.disabled"
        Move-Item -Path $file -Destination $newName -Force
        Write-Host "✓ Désactivé: $file" -ForegroundColor Green
    }
}

foreach ($file in $controllers) {
    if (Test-Path $file) {
        $newName = $file -replace "\.java$", ".java.disabled"
        Move-Item -Path $file -Destination $newName -Force
        Write-Host "✓ Désactivé: $file" -ForegroundColor Green
    }
}

Write-Host "`nServices et contrôleurs désactivés avec succès!" -ForegroundColor Green
Write-Host "Pour les réactiver, renommez les fichiers .java.disabled en .java" -ForegroundColor Cyan
