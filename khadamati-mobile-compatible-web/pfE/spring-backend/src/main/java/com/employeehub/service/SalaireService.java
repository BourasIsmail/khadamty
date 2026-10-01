package com.employeehub.service;

import com.employeehub.model.Salaire;
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

    public Salaire createSalaire(Salaire salaire) {
        return salaireRepository.save(salaire);
    }

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

    public Salaire updateSalaire(String id, Salaire salaireDetails) {
        Salaire salaire = salaireRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salaire non trouvé avec l'ID: " + id));

        salaire.setEmployee(salaireDetails.getEmployee());
        salaire.setGrade(salaireDetails.getGrade());
        salaire.setAnnee(salaireDetails.getAnnee());
        salaire.setMois(salaireDetails.getMois());
        salaire.setEchelon(salaireDetails.getEchelon());
        salaire.setSalaireNet(salaireDetails.getSalaireNet());
        salaire.setAllocFamiliale(salaireDetails.getAllocFamiliale());
        salaire.setRetenueMutuelle(salaireDetails.getRetenueMutuelle());
        salaire.setRappel(salaireDetails.getRappel());

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
