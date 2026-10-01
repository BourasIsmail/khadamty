package com.employeehub.repository;

import com.employeehub.model.Prime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrimeRepository extends JpaRepository<Prime, String> {
    
    List<Prime> findByEmployeeId(Long employeeId);
    
    List<Prime> findByEmployeeIdAndDatePrimeBetween(Long employeeId, LocalDate startDate, LocalDate endDate);
    
    List<Prime> findByTypePrime(Prime.TypePrime typePrime);
    
    List<Prime> findByDatePrimeBetween(LocalDate startDate, LocalDate endDate);
}
