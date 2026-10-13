package com.employeehub.service;

import com.employeehub.model.Credit;
import com.employeehub.model.RetenueLigne;
import com.employeehub.model.Salaire;
import com.employeehub.repository.CreditRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class EngagementServiceTest {

    private CreditRepository creditRepository;
    private EngagementService service;

    private static BigDecimal d(String v) { return new BigDecimal(v); }

    @BeforeEach
    void setUp() {
        creditRepository = mock(CreditRepository.class);
        service = new EngagementService(creditRepository);
    }

    private Credit credit(String banque, String dossier, String mensualite, String total, String restant, int mois) {
        Credit c = new Credit();
        c.setBanque(banque);
        c.setNumDossier(dossier);
        c.setMensualite(d(mensualite));
        c.setMontantGlobal(d(total));
        c.setMontantRestant(d(restant));
        c.setNbMoisRestants(mois);
        return c;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> list(Map<String, Object> result) { return (List<Map<String, Object>>) result.get("engagements"); }

    @Test
    void listsActiveCreditsOnlyAndComputesProgress() {
        when(creditRepository.findByEmployeeId(1L)).thenReturn(List.of(
            credit("Banque Populaire", "BP-1", "1200", "24000", "6000", 5),
            credit("CIH", "CIH-9", "800", "8000", "0", 0)));            // soldé : non affiché

        Map<String, Object> r = service.forEmployee(1L, null);

        assertEquals(1, r.get("nombre"));
        assertEquals(75, list(r).get(0).get("progression"));            // (24000-6000)/24000
        assertEquals(0, d("1200").compareTo((BigDecimal) r.get("totalMensualites")));
    }

    @Test
    void addsLoansFromThePayslipButNotDuplicatesOrPlainDeductions() {
        when(creditRepository.findByEmployeeId(1L)).thenReturn(List.of(credit("BP", "D-42", "1200", "24000", "12000", 10)));

        Salaire payslip = new Salaire();
        RetenueLigne mutuelle = new RetenueLigne("Mutuelle", d("150"));                          // retenue simple
        RetenueLigne same = new RetenueLigne("Crédit bancaire", d("1200"));                       // même dossier que le crédit
        same.setNumeroDossier("d-42");
        same.setMoisRestants(10);
        RetenueLigne advance = new RetenueLigne("Avance sur salaire", d("300"));
        advance.setNumeroDossier("A-1");
        advance.setMontantTotal(d("1500"));
        advance.setMontantRestant(d("900"));
        advance.setMoisRestants(3);
        RetenueLigne paidOff = new RetenueLigne("Avance ancienne", d("100"));
        paidOff.setMoisRestants(0);
        paidOff.setMontantRestant(d("0"));
        payslip.setRetenues(List.of(mutuelle, same, advance, paidOff));

        Map<String, Object> r = service.forEmployee(1L, payslip);

        assertEquals(2, r.get("nombre"));
        assertEquals("paie", list(r).get(1).get("source"));
        assertEquals("Avance sur salaire", list(r).get(1).get("libelle"));
        assertEquals(40, list(r).get(1).get("progression"));
        assertEquals(0, d("1500").compareTo((BigDecimal) r.get("totalMensualites")));            // 1200 + 300
    }

    @Test
    void noEngagementsGivesAnEmptyList() {
        when(creditRepository.findByEmployeeId(1L)).thenReturn(List.of());
        Map<String, Object> r = service.forEmployee(1L, new Salaire());
        assertEquals(0, r.get("nombre"));
        assertTrue(list(r).isEmpty());
        assertNull(EngagementService.progression(null, d("10")));
    }
}
