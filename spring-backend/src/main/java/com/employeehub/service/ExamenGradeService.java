package com.employeehub.service;

import com.employeehub.model.ExamenGrade;
import com.employeehub.repository.ExamenGradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExamenGradeService {

    @Autowired
    private ExamenGradeRepository examenGradeRepository;

    public ExamenGrade createExamenGrade(ExamenGrade e) { return examenGradeRepository.save(e); }

    public List<ExamenGrade> getAllExamensGrade() { return examenGradeRepository.findAll(); }

    public Optional<ExamenGrade> getExamenGradeById(String id) { return examenGradeRepository.findById(id); }

    public List<ExamenGrade> getExamensByYear(Year annee) {
        return examenGradeRepository.findByAnnee((short) annee.getValue());
    }

    public List<ExamenGrade> getExamensByGradeCible(String gradeCibleId) {
        return examenGradeRepository.findByGradeCibleId(gradeCibleId);
    }

    public List<ExamenGrade> getExamensAvenir() { return examenGradeRepository.findAll(); }

    public List<ExamenGrade> getExamensPasses() { return examenGradeRepository.findAll(); }

    public ExamenGrade updateExamenGrade(String id, ExamenGrade details) {
        ExamenGrade e = examenGradeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Examen non trouvé: " + id));
        e.setGradeCible(details.getGradeCible());
        e.setAnnee(details.getAnnee());
        e.setDateExamen(details.getDateExamen());
        e.setDateDepot(details.getDateDepot());
        e.setNbPostes(details.getNbPostes());
        e.setLieu(details.getLieu());
        e.setDetails(details.getDetails());
        e.setResultatsEcrit(details.getResultatsEcrit());
        e.setResultatsFinal(details.getResultatsFinal());
        return examenGradeRepository.save(e);
    }

    public void deleteExamenGrade(String id) { examenGradeRepository.deleteById(id); }
}
