package com.employeehub.service;

import com.employeehub.model.TypeDemande;
import com.employeehub.repository.TypeDemandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TypeDemandeService {

    @Autowired
    private TypeDemandeRepository typeDemandeRepository;

    public TypeDemande createTypeDemande(TypeDemande t) { return typeDemandeRepository.save(t); }

    public List<TypeDemande> getAllTypesDemandes() { return typeDemandeRepository.findAll(); }

    public Optional<TypeDemande> getTypeDemandeById(String id) { return typeDemandeRepository.findById(id); }

    public Optional<TypeDemande> getTypeDemandeByCode(String code) { return typeDemandeRepository.findByCode(code); }

    public List<TypeDemande> getActiveTypesDemandes() { return typeDemandeRepository.findByEstActifTrue(); }

    public List<TypeDemande> searchTypesDemandesByLibelleFr(String libelle) {
        return typeDemandeRepository.findAll().stream()
            .filter(t -> t.getLibelle() != null && t.getLibelle().toLowerCase().contains(libelle.toLowerCase()))
            .toList();
    }

    public List<TypeDemande> searchTypesDemandesByLibelleAr(String libelle) {
        return typeDemandeRepository.findAll().stream()
            .filter(t -> t.getLibelle() != null && t.getLibelle().contains(libelle))
            .toList();
    }

    public TypeDemande updateTypeDemande(String id, TypeDemande details) {
        TypeDemande t = typeDemandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TypeDemande non trouvé: " + id));
        t.setCode(details.getCode());
        t.setLibelle(details.getLibelle());
        t.setDescription(details.getDescription());
        t.setEstActif(details.getEstActif());
        return typeDemandeRepository.save(t);
    }

    public TypeDemande toggleTypeDemandeStatus(String id) {
        TypeDemande t = typeDemandeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TypeDemande non trouvé: " + id));
        t.setEstActif(!t.getEstActif());
        return typeDemandeRepository.save(t);
    }

    public void deleteTypeDemande(String id) { typeDemandeRepository.deleteById(id); }

    public boolean existsByCode(String code) { return typeDemandeRepository.existsByCode(code); }

    public long countActiveTypesDemandes() { return typeDemandeRepository.findByEstActifTrue().size(); }
}
