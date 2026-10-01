package com.employeehub.service;

import com.employeehub.model.Structure;
import com.employeehub.repository.StructureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StructureService {

    @Autowired
    private StructureRepository structureRepository;

    public Structure createStructure(Structure structure) {
        return structureRepository.save(structure);
    }

    public List<Structure> getAllStructures() {
        return structureRepository.findAll();
    }

    public Optional<Structure> getStructureById(String id) {
        return structureRepository.findById(id);
    }

    public Optional<Structure> getStructureByCode(String code) {
        return structureRepository.findByCode(code);
    }

    public List<Structure> getStructuresByDelegation(String delegationId) {
        return structureRepository.findByDelegationId(delegationId);
    }

    public List<Structure> getStructuresByType(Structure.TypeStructure type) {
        return structureRepository.findByType(type);
    }

    public List<Structure> getActiveStructures() {
        return structureRepository.findByEstActiveTrue();
    }

    public List<Structure> getRootStructures() {
        return structureRepository.findByParentIsNull();
    }

    public List<Structure> getChildStructures(String parentId) {
        return structureRepository.findByParentId(parentId);
    }

    public List<Structure> searchStructuresByNomFr(String nom) {
        return structureRepository.findAll().stream()
            .filter(s -> s.getNomFr() != null && s.getNomFr().toLowerCase().contains(nom.toLowerCase()))
            .toList();
    }

    public List<Structure> searchStructuresByNomAr(String nom) {
        return structureRepository.findAll().stream()
            .filter(s -> s.getNomAr() != null && s.getNomAr().contains(nom))
            .toList();
    }

    public Structure updateStructure(String id, Structure structureDetails) {
        Structure structure = structureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Structure non trouvée avec l'ID: " + id));

        structure.setDelegation(structureDetails.getDelegation());
        structure.setParent(structureDetails.getParent());
        structure.setType(structureDetails.getType());
        structure.setCode(structureDetails.getCode());
        structure.setNomAr(structureDetails.getNomAr());
        structure.setNomFr(structureDetails.getNomFr());
        structure.setAdresse(structureDetails.getAdresse());
        structure.setEstActive(structureDetails.getEstActive());

        return structureRepository.save(structure);
    }

    public Structure toggleStructureStatus(String id) {
        Structure structure = structureRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Structure non trouvée avec l'ID: " + id));
        structure.setEstActive(!structure.getEstActive());
        return structureRepository.save(structure);
    }

    public void deleteStructure(String id) {
        structureRepository.deleteById(id);
    }

    public boolean existsByCode(String code) {
        return structureRepository.existsByCode(code);
    }

    public long countByDelegation(String delegationId) {
        return structureRepository.findByDelegationId(delegationId).size();
    }

    public long countByType(Structure.TypeStructure type) {
        return structureRepository.findByType(type).size();
    }
}
