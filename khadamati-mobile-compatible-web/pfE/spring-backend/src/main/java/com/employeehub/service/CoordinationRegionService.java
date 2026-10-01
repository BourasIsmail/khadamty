package com.employeehub.service;

import com.employeehub.model.CoordinationRegion;
import com.employeehub.repository.CoordinationRegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CoordinationRegionService {

    @Autowired
    private CoordinationRegionRepository coordinationRegionRepository;

    public CoordinationRegion createRegion(CoordinationRegion r) { return coordinationRegionRepository.save(r); }

    public List<CoordinationRegion> getAllRegions() { return coordinationRegionRepository.findAll(); }

    public Optional<CoordinationRegion> getRegionById(String id) { return coordinationRegionRepository.findById(id); }

    public Optional<CoordinationRegion> getRegionByCode(String code) { return coordinationRegionRepository.findByCodeRegion(code); }

    public List<CoordinationRegion> getActiveRegions() { return coordinationRegionRepository.findByEstActiveTrue(); }

    public List<CoordinationRegion> searchRegionsByNomFr(String nom) {
        return coordinationRegionRepository.findAll().stream()
            .filter(r -> r.getNomRegionFr() != null && r.getNomRegionFr().toLowerCase().contains(nom.toLowerCase()))
            .toList();
    }

    public List<CoordinationRegion> searchRegionsByNomAr(String nom) {
        return coordinationRegionRepository.findAll().stream()
            .filter(r -> r.getNomRegionAr() != null && r.getNomRegionAr().contains(nom))
            .toList();
    }

    public CoordinationRegion updateRegion(String id, CoordinationRegion details) {
        CoordinationRegion r = coordinationRegionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Région non trouvée: " + id));
        r.setCodeRegion(details.getCodeRegion());
        r.setNomRegionAr(details.getNomRegionAr());
        r.setNomRegionFr(details.getNomRegionFr());
        r.setNomCoordAr(details.getNomCoordAr());
        r.setNomCoordFr(details.getNomCoordFr());
        r.setTelephone(details.getTelephone());
        r.setAdresse(details.getAdresse());
        r.setEstActive(details.getEstActive());
        return coordinationRegionRepository.save(r);
    }

    public CoordinationRegion toggleRegionStatus(String id) {
        CoordinationRegion r = coordinationRegionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Région non trouvée: " + id));
        r.setEstActive(!r.getEstActive());
        return coordinationRegionRepository.save(r);
    }

    public void deleteRegion(String id) { coordinationRegionRepository.deleteById(id); }

    public boolean existsByCode(String code) { return coordinationRegionRepository.existsByCodeRegion(code); }

    public long countActiveRegions() { return coordinationRegionRepository.findByEstActiveTrue().size(); }
}
