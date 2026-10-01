package com.employeehub.repository;

import com.employeehub.model.ExamenGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamenGradeRepository extends JpaRepository<ExamenGrade, String> {
    
    List<ExamenGrade> findByAnnee(Short annee);
    
    List<ExamenGrade> findByGradeCibleId(String gradeCibleId);
    
    List<ExamenGrade> findByAnneeOrderByDateExamenDesc(Short annee);
}
