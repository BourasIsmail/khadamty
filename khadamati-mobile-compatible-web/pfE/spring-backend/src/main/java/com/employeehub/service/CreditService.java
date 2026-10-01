package com.employeehub.service;

import com.employeehub.model.Credit;
import com.employeehub.repository.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CreditService {

    @Autowired
    private CreditRepository creditRepository;

    public Credit createCredit(Credit credit) { return creditRepository.save(credit); }

    public List<Credit> getAllCredits() { return creditRepository.findAll(); }

    public Optional<Credit> getCreditById(String id) { return creditRepository.findById(id); }

    public List<Credit> getCreditsByEmployee(String employeeId) {
        try { return creditRepository.findByEmployeeId(Long.parseLong(employeeId)); }
        catch (NumberFormatException e) { return List.of(); }
    }

    public Credit updateCredit(String id, Credit details) {
        Credit credit = creditRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Crédit non trouvé: " + id));
        credit.setEmployee(details.getEmployee());
        credit.setBanque(details.getBanque());
        credit.setNumDossier(details.getNumDossier());
        credit.setTypeCredit(details.getTypeCredit());
        credit.setMensualite(details.getMensualite());
        credit.setMontantGlobal(details.getMontantGlobal());
        credit.setMontantRestant(details.getMontantRestant());
        credit.setNbMoisRestants(details.getNbMoisRestants());
        credit.setDateDebut(details.getDateDebut());
        return creditRepository.save(credit);
    }

    public void deleteCredit(String id) { creditRepository.deleteById(id); }
}
