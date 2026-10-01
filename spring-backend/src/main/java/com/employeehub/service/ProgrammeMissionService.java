package com.employeehub.service;

import com.employeehub.model.ProgrammeMission;
import com.employeehub.repository.ProgrammeMissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProgrammeMissionService {

    @Autowired
    private ProgrammeMissionRepository programmeMissionRepository;

    public ProgrammeMission createProgrammeMission(ProgrammeMission p) { return programmeMissionRepository.save(p); }

    public List<ProgrammeMission> getAllProgrammesMission() { return programmeMissionRepository.findAll(); }

    public Optional<ProgrammeMission> getProgrammeMissionById(String id) { return programmeMissionRepository.findById(id); }

    public Optional<ProgrammeMission> getProgrammeMissionByCode(String code) { return programmeMissionRepository.findByCode(code); }

    public List<ProgrammeMission> searchProgrammesMissionByLibelleFr(String nom) {
        return programmeMissionRepository.findAll().stream()
            .filter(p -> p.getNomFr() != null && p.getNomFr().toLowerCase().contains(nom.toLowerCase()))
            .toList();
    }

    public List<ProgrammeMission> searchProgrammesMissionByLibelleAr(String nom) {
        return programmeMissionRepository.findAll().stream()
            .filter(p -> p.getNomAr() != null && p.getNomAr().contains(nom))
            .toList();
    }

    public ProgrammeMission updateProgrammeMission(String id, ProgrammeMission details) {
        ProgrammeMission p = programmeMissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Programme non trouvé: " + id));
        p.setCode(details.getCode());
        p.setNomFr(details.getNomFr());
        p.setNomAr(details.getNomAr());
        p.setMontantMax(details.getMontantMax());
        p.setEstActif(details.getEstActif());
        return programmeMissionRepository.save(p);
    }

    public void deleteProgrammeMission(String id) { programmeMissionRepository.deleteById(id); }

    public boolean existsByCode(String code) { return programmeMissionRepository.existsByCode(code); }
}
