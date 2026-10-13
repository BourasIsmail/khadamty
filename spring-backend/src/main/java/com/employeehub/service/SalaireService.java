package com.employeehub.service;

import com.employeehub.model.Employee;
import com.employeehub.model.Grade;
import com.employeehub.model.Salaire;
import com.employeehub.repository.EmployeeRepository;
import com.employeehub.repository.GradeRepository;
import com.employeehub.repository.SalaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SalaireService {

    @Autowired
    private SalaireRepository salaireRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private GradeRepository gradeRepository;

    /** Saisie mensuelle d'un bulletin : un seul par employé et par période ; le net est calculé. */
    public Salaire createSalaire(Salaire salaire) {
        if (salaire.getEmployee() == null || salaire.getEmployee().getId() == null)
            throw new RuntimeException("L'employé est obligatoire");
        Employee employee = employeeRepository.findById(salaire.getEmployee().getId())
            .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        if (salaire.getAnnee() == null || salaire.getAnnee() < 2000 || salaire.getAnnee() > 2100)
            throw new RuntimeException("Année invalide");
        if (salaire.getMois() == null || salaire.getMois() < 1 || salaire.getMois() > 12)
            throw new RuntimeException("Mois invalide (1 à 12)");
        if (salaireRepository.existsByEmployeeIdAndAnneeAndMois(employee.getId(), salaire.getAnnee(), salaire.getMois()))
            throw new RuntimeException("Un bulletin existe déjà pour cet employé et cette période");

        salaire.setId(null);
        salaire.setEmployee(employee);
        salaire.setGrade(resolveGrade(salaire.getGrade()));
        normalizeAndValidate(salaire);
        return salaireRepository.save(salaire);
    }

    private Grade resolveGrade(Grade grade) {
        if (grade == null || grade.getId() == null || grade.getId().isBlank()) return null;
        return gradeRepository.findById(grade.getId()).orElse(null);
    }

    /** Les montants vides valent 0, aucun montant ne peut être négatif, et le net est recalculé. */
    private void normalizeAndValidate(Salaire s) {
        if (s.getSalaireBase() == null || s.getSalaireBase().signum() <= 0)
            throw new RuntimeException("Le salaire de base est obligatoire");
        s.setIndemniteLogement(nz(s.getIndemniteLogement()));
        s.setIndemniteTransport(nz(s.getIndemniteTransport()));
        s.setIndemniteFonction(nz(s.getIndemniteFonction()));
        s.setPrimes(nz(s.getPrimes()));
        s.setAllocFamiliale(nz(s.getAllocFamiliale()));
        s.setRappel(nz(s.getRappel()));
        s.setRetenueRetraite(nz(s.getRetenueRetraite()));
        s.setRetenueAmo(nz(s.getRetenueAmo()));
        s.setRetenueMutuelle(nz(s.getRetenueMutuelle()));
        s.setRetenueIr(nz(s.getRetenueIr()));
        s.setAutresRetenues(nz(s.getAutresRetenues()));
        for (java.math.BigDecimal v : new java.math.BigDecimal[]{
                s.getSalaireBase(), s.getIndemniteLogement(), s.getIndemniteTransport(), s.getIndemniteFonction(),
                s.getPrimes(), s.getAllocFamiliale(), s.getRappel(), s.getRetenueRetraite(), s.getRetenueAmo(),
                s.getRetenueMutuelle(), s.getRetenueIr(), s.getAutresRetenues()}) {
            if (v.signum() < 0) throw new RuntimeException("Les montants ne peuvent pas être négatifs");
        }
        s.recomputeNet();
        if (s.getSalaireNet().signum() < 0)
            throw new RuntimeException("Les retenues dépassent la rémunération");
    }

    private static java.math.BigDecimal nz(java.math.BigDecimal v) { return v != null ? v : java.math.BigDecimal.ZERO; }

    public List<Salaire> getAllSalaires() {
        return salaireRepository.findAll();
    }

    public Optional<Salaire> getSalaireById(String id) {
        return salaireRepository.findById(id);
    }

    public List<Salaire> getSalairesByEmployee(String employeeId) {
        try {
            return salaireRepository.findByEmployeeId(Long.parseLong(employeeId));
        } catch (NumberFormatException e) {
            return List.of();
        }
    }

    public List<Salaire> getSalairesByYear(Integer annee) {
        return salaireRepository.findAll().stream()
            .filter(s -> s.getAnnee() != null && s.getAnnee().intValue() == annee)
            .toList();
    }

    public List<Salaire> getSalairesByMonth(Integer annee, Integer mois) {
        return salaireRepository.findByAnneeAndMois(annee.shortValue(), mois.byteValue());
    }

    public Double calculateTotalSalaireByEmployee(String employeeId) {
        return getSalairesByEmployee(employeeId).stream()
            .mapToDouble(s -> s.getSalaireNet() != null ? s.getSalaireNet().doubleValue() : 0.0)
            .sum();
    }

    /** Correction d'un bulletin : l'employé et la période ne changent pas, seuls les montants. */
    public Salaire updateSalaire(String id, Salaire d) {
        Salaire salaire = salaireRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salaire non trouvé avec l'ID: " + id));

        salaire.setGrade(resolveGrade(d.getGrade()));
        salaire.setEchelon(d.getEchelon());
        salaire.setSalaireBase(d.getSalaireBase());
        salaire.setIndemniteLogement(d.getIndemniteLogement());
        salaire.setIndemniteTransport(d.getIndemniteTransport());
        salaire.setIndemniteFonction(d.getIndemniteFonction());
        salaire.setPrimes(d.getPrimes());
        salaire.setAllocFamiliale(d.getAllocFamiliale());
        salaire.setRappel(d.getRappel());
        salaire.setRetenueRetraite(d.getRetenueRetraite());
        salaire.setRetenueAmo(d.getRetenueAmo());
        salaire.setRetenueMutuelle(d.getRetenueMutuelle());
        salaire.setRetenueIr(d.getRetenueIr());
        salaire.setAutresRetenues(d.getAutresRetenues());
        normalizeAndValidate(salaire);
        return salaireRepository.save(salaire);
    }

    public Salaire markAsPaid(String id, java.time.LocalDate datePaiement) {
        Salaire salaire = salaireRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salaire non trouvé avec l'ID: " + id));
        // Le modèle n'a pas de champ estPaye, on retourne juste le salaire
        return salaireRepository.save(salaire);
    }

    public void deleteSalaire(String id) {
        salaireRepository.deleteById(id);
    }

    public long countSalairesPayes() {
        return salaireRepository.count();
    }
}
