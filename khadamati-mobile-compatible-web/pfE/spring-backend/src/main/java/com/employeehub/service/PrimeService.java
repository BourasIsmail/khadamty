package com.employeehub.service;

import com.employeehub.model.Prime;
import com.employeehub.repository.PrimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PrimeService {

    @Autowired
    private PrimeRepository primeRepository;

    public Prime createPrime(Prime prime) { return primeRepository.save(prime); }

    public List<Prime> getAllPrimes() { return primeRepository.findAll(); }

    public Optional<Prime> getPrimeById(String id) { return primeRepository.findById(id); }

    public List<Prime> getPrimesByEmployee(String employeeId) {
        try { return primeRepository.findByEmployeeId(Long.parseLong(employeeId)); }
        catch (NumberFormatException e) { return List.of(); }
    }

    public Prime updatePrime(String id, Prime details) {
        Prime prime = primeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Prime non trouvée: " + id));
        prime.setEmployee(details.getEmployee());
        prime.setTypePrime(details.getTypePrime());
        prime.setMontantBrut(details.getMontantBrut());
        prime.setIr(details.getIr());
        prime.setMontantNet(details.getMontantNet());
        prime.setDatePrime(details.getDatePrime());
        return primeRepository.save(prime);
    }

    public void deletePrime(String id) { primeRepository.deleteById(id); }
}
