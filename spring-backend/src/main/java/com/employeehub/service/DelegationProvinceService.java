package com.employeehub.service;

import com.employeehub.model.DelegationProvince;
import com.employeehub.repository.DelegationProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DelegationProvinceService {

    @Autowired
    private DelegationProvinceRepository delegationProvinceRepository;

    public DelegationProvince createDelegation(DelegationProvince d) { return delegationProvinceRepository.save(d); }

    public List<DelegationProvince> getAllDelegations() { return delegationProvinceRepository.findAll(); }

    public Optional<DelegationProvince> getDelegationById(String id) { return delegationProvinceRepository.findById(id); }

    public Optional<DelegationProvince> getDelegationByCode(String code) { return delegationProvinceRepository.findByCodeProvince(code); }

    public List<DelegationProvince> getDelegationsByRegion(String coordinationId) {
        return delegationProvinceRepository.findByCoordinationId(coordinationId);
    }

    public List<DelegationProvince> getActiveDelegations() { return delegationProvinceRepository.findByEstActiveTrue(); }

    public List<DelegationProvince> getActiveDelegationsByRegion(String coordinationId) {
        return delegationProvinceRepository.findByCoordinationId(coordinationId).stream()
            .filter(d -> Boolean.TRUE.equals(d.getEstActive()))
            .toList();
    }

    public List<DelegationProvince> searchDelegationsByNomFr(String nom) {
        return delegationProvinceRepository.findAll().stream()
            .filter(d -> d.getNomProvinceFr() != null && d.getNomProvinceFr().toLowerCase().contains(nom.toLowerCase()))
            .toList();
    }

    public List<DelegationProvince> searchDelegationsByNomAr(String nom) {
        return delegationProvinceRepository.findAll().stream()
            .filter(d -> d.getNomProvinceAr() != null && d.getNomProvinceAr().contains(nom))
            .toList();
    }

    public DelegationProvince updateDelegation(String id, DelegationProvince details) {
        DelegationProvince d = delegationProvinceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Délégation non trouvée: " + id));
        d.setCoordination(details.getCoordination());
        d.setCodeProvince(details.getCodeProvince());
        d.setNomProvinceAr(details.getNomProvinceAr());
        d.setNomProvinceFr(details.getNomProvinceFr());
        d.setNomDelegAr(details.getNomDelegAr());
        d.setNomDelegFr(details.getNomDelegFr());
        d.setTelephone(details.getTelephone());
        d.setTelephoneInwi(details.getTelephoneInwi());
        d.setTelephoneFlotte(details.getTelephoneFlotte());
        d.setAdresse(details.getAdresse());
        d.setEstActive(details.getEstActive());
        return delegationProvinceRepository.save(d);
    }

    public DelegationProvince toggleDelegationStatus(String id) {
        DelegationProvince d = delegationProvinceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Délégation non trouvée: " + id));
        d.setEstActive(!d.getEstActive());
        return delegationProvinceRepository.save(d);
    }

    public void deleteDelegation(String id) { delegationProvinceRepository.deleteById(id); }

    public boolean existsByCode(String code) { return delegationProvinceRepository.existsByCodeProvince(code); }

    public long countByRegion(String coordinationId) { return delegationProvinceRepository.findByCoordinationId(coordinationId).size(); }

    public long countActiveDelegations() { return delegationProvinceRepository.findByEstActiveTrue().size(); }
}
