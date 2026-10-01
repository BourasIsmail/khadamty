package com.employeehub.repository;

import com.employeehub.model.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditRepository extends JpaRepository<Credit, String> {
    
    List<Credit> findByEmployeeId(Long employeeId);
    
    List<Credit> findByTypeCredit(Credit.TypeCredit typeCredit);
    
    List<Credit> findByEmployeeIdAndTypeCredit(Long employeeId, Credit.TypeCredit typeCredit);
}
