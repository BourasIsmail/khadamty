package com.employeehub.service;

import com.employeehub.model.TypeDocument;
import com.employeehub.repository.TypeDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TypeDocumentService {

    @Autowired
    private TypeDocumentRepository typeDocumentRepository;

    public TypeDocument createTypeDocument(TypeDocument t) { return typeDocumentRepository.save(t); }

    public List<TypeDocument> getAllTypesDocuments() { return typeDocumentRepository.findAll(); }

    public Optional<TypeDocument> getTypeDocumentById(String id) { return typeDocumentRepository.findById(id); }

    public Optional<TypeDocument> getTypeDocumentByCode(String code) {
        return typeDocumentRepository.findByLibelle(code);
    }

    public List<TypeDocument> getActiveTypesDocuments() { return typeDocumentRepository.findAll(); }

    public List<TypeDocument> searchTypesDocumentsByLibelleFr(String libelle) {
        return typeDocumentRepository.findAll().stream()
            .filter(t -> t.getLibelle() != null && t.getLibelle().toLowerCase().contains(libelle.toLowerCase()))
            .toList();
    }

    public List<TypeDocument> searchTypesDocumentsByLibelleAr(String libelle) {
        return typeDocumentRepository.findAll().stream()
            .filter(t -> t.getLibelle() != null && t.getLibelle().contains(libelle))
            .toList();
    }

    public TypeDocument updateTypeDocument(String id, TypeDocument details) {
        TypeDocument t = typeDocumentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TypeDocument non trouvé: " + id));
        t.setLibelle(details.getLibelle());
        t.setDossier(details.getDossier());
        return typeDocumentRepository.save(t);
    }

    public TypeDocument toggleTypeDocumentStatus(String id) {
        return typeDocumentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TypeDocument non trouvé: " + id));
    }

    public void deleteTypeDocument(String id) { typeDocumentRepository.deleteById(id); }

    public boolean existsByCode(String code) { return typeDocumentRepository.existsByLibelle(code); }

    public long countActiveTypesDocuments() { return typeDocumentRepository.count(); }
}
