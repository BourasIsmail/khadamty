package com.employeehub.service;

import com.employeehub.model.Credit;
import com.employeehub.model.RetenueLigne;
import com.employeehub.model.Salaire;
import com.employeehub.repository.CreditRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Engagements financiers d'un employé : crédits enregistrés par la RH et prêts/avances qui apparaissent
 * dans le détail des retenues de son dernier bulletin (n° de dossier, restant dû, mois restants).
 */
@Service
public class EngagementService {

    private final CreditRepository creditRepository;

    public EngagementService(CreditRepository creditRepository) {
        this.creditRepository = creditRepository;
    }

    public Map<String, Object> forEmployee(Long employeeId, Salaire latestPayslip) {
        List<Map<String, Object>> engagements = new ArrayList<>();
        BigDecimal totalMensualites = BigDecimal.ZERO;
        List<String> knownFiles = new ArrayList<>();

        for (Credit c : creditRepository.findByEmployeeId(employeeId)) {
            boolean active = (c.getNbMoisRestants() != null && c.getNbMoisRestants() > 0)
                    || (c.getMontantRestant() != null && c.getMontantRestant().signum() > 0);
            if (!active) continue;
            engagements.add(line("credit", c.getBanque(), typeLabel(c.getTypeCredit()), c.getNumDossier(),
                    c.getMensualite(), c.getMontantGlobal(), c.getMontantRestant(), c.getNbMoisRestants(),
                    c.getDateDebut() != null ? c.getDateDebut().toString() : null));
            totalMensualites = totalMensualites.add(zero(c.getMensualite()));
            if (c.getNumDossier() != null && !c.getNumDossier().isBlank()) knownFiles.add(c.getNumDossier().trim().toLowerCase());
        }

        if (latestPayslip != null) {
            for (RetenueLigne l : latestPayslip.getRetenues()) {
                boolean loanLike = l.getMoisRestants() != null || l.getMontantRestant() != null
                        || (l.getNumeroDossier() != null && !l.getNumeroDossier().isBlank());
                if (!loanLike) continue;
                if (l.getNumeroDossier() != null && knownFiles.contains(l.getNumeroDossier().trim().toLowerCase())) continue; // déjà listé
                if (l.getMoisRestants() != null && l.getMoisRestants() <= 0
                        && (l.getMontantRestant() == null || l.getMontantRestant().signum() <= 0)) continue;    // soldé
                engagements.add(line("paie", l.getType(), l.getType(), l.getNumeroDossier(),
                        l.getMontant(), l.getMontantTotal(), l.getMontantRestant(), l.getMoisRestants(), null));
                totalMensualites = totalMensualites.add(zero(l.getMontant()));
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("engagements", engagements);
        result.put("nombre", engagements.size());
        result.put("totalMensualites", totalMensualites);
        return result;
    }

    private Map<String, Object> line(String source, String libelle, String type, String dossier,
                                     BigDecimal mensualite, BigDecimal total, BigDecimal restant,
                                     Integer moisRestants, String dateDebut) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("source", source);
        m.put("libelle", libelle);
        m.put("type", type);
        m.put("numeroDossier", dossier);
        m.put("mensualite", zero(mensualite));
        m.put("montantTotal", total);
        m.put("montantRestant", restant);
        m.put("moisRestants", moisRestants);
        m.put("dateDebut", dateDebut);
        m.put("progression", progression(total, restant));
        return m;
    }

    /** Part déjà remboursée, en pourcentage (0 à 100) ; nulle si le total n'est pas connu. */
    static Integer progression(BigDecimal total, BigDecimal restant) {
        if (total == null || restant == null || total.signum() <= 0) return null;
        BigDecimal paid = total.subtract(restant).multiply(BigDecimal.valueOf(100)).divide(total, 0, RoundingMode.HALF_UP);
        return Math.max(0, Math.min(100, paid.intValue()));
    }

    private static String typeLabel(Credit.TypeCredit type) {
        if (type == null) return "Crédit";
        return type == Credit.TypeCredit.bancaire ? "Crédit bancaire" : "Crédit interne AOS";
    }

    private static BigDecimal zero(BigDecimal v) { return v != null ? v : BigDecimal.ZERO; }
}
