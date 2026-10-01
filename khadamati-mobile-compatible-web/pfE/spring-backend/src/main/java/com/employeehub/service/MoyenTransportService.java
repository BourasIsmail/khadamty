package com.employeehub.service;

import com.employeehub.model.MoyenTransport;
import com.employeehub.repository.MoyenTransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MoyenTransportService {

    @Autowired
    private MoyenTransportRepository moyenTransportRepository;

    public MoyenTransport createMoyenTransport(MoyenTransport m) { return moyenTransportRepository.save(m); }

    public List<MoyenTransport> getAllMoyensTransport() { return moyenTransportRepository.findAll(); }

    public Optional<MoyenTransport> getMoyenTransportById(String id) { return moyenTransportRepository.findById(id); }

    public Optional<MoyenTransport> getMoyenTransportByCode(String code) { return moyenTransportRepository.findByCode(code); }

    public List<MoyenTransport> searchMoyensTransportByLibelleFr(String libelle) {
        return moyenTransportRepository.findAll().stream()
            .filter(m -> m.getLibelleFr() != null && m.getLibelleFr().toLowerCase().contains(libelle.toLowerCase()))
            .toList();
    }

    public List<MoyenTransport> searchMoyensTransportByLibelleAr(String libelle) {
        return moyenTransportRepository.findAll().stream()
            .filter(m -> m.getLibelleAr() != null && m.getLibelleAr().contains(libelle))
            .toList();
    }

    public MoyenTransport updateMoyenTransport(String id, MoyenTransport details) {
        MoyenTransport m = moyenTransportRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Moyen de transport non trouvé: " + id));
        m.setCode(details.getCode());
        m.setLibelleFr(details.getLibelleFr());
        m.setLibelleAr(details.getLibelleAr());
        m.setEstActif(details.getEstActif());
        return moyenTransportRepository.save(m);
    }

    public void deleteMoyenTransport(String id) { moyenTransportRepository.deleteById(id); }

    public boolean existsByCode(String code) { return moyenTransportRepository.existsByCode(code); }
}
