package com.employeehub.service;

import com.employeehub.model.Grade;
import com.employeehub.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    public Grade createGrade(Grade grade) { return gradeRepository.save(grade); }

    public List<Grade> getAllGrades() { return gradeRepository.findAll(); }

    public Optional<Grade> getGradeById(String id) { return gradeRepository.findById(id); }

    public Optional<Grade> getGradeByCode(Integer code) { return gradeRepository.findByCode(code); }

    public List<Grade> getGradesByEchelle(Integer echelle) {
        return gradeRepository.findAll().stream()
            .filter(g -> echelle.equals(g.getEchelle()))
            .toList();
    }

    public List<Grade> searchGradesByLibelleFr(String libelle) {
        return gradeRepository.findAll().stream()
            .filter(g -> g.getLibelleFr() != null && g.getLibelleFr().toLowerCase().contains(libelle.toLowerCase()))
            .toList();
    }

    public List<Grade> searchGradesByLibelleAr(String libelle) {
        return gradeRepository.findAll().stream()
            .filter(g -> g.getLibelleAr() != null && g.getLibelleAr().contains(libelle))
            .toList();
    }

    public Grade updateGrade(String id, Grade details) {
        Grade grade = gradeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Grade non trouvé: " + id));
        grade.setCode(details.getCode());
        grade.setLibelleFr(details.getLibelleFr());
        grade.setLibelleAr(details.getLibelleAr());
        grade.setEchelle(details.getEchelle());
        grade.setNbEchelons(details.getNbEchelons());
        grade.setTaux(details.getTaux());
        return gradeRepository.save(grade);
    }

    public void deleteGrade(String id) { gradeRepository.deleteById(id); }

    public boolean existsByCode(Integer code) { return gradeRepository.existsByCode(code); }

    public long countGrades() { return gradeRepository.count(); }
}
