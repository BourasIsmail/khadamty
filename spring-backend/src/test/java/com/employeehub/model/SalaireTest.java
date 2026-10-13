package com.employeehub.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SalaireTest {

    private static BigDecimal d(String v) { return new BigDecimal(v); }

    @Test
    void netIsGainsMinusRetenues() {
        Salaire s = new Salaire();
        s.setSalaireBase(d("8000"));
        s.setIndemniteLogement(d("500"));
        s.setIndemniteTransport(d("300"));
        s.setPrimes(d("200"));
        s.setAllocFamiliale(d("300"));
        s.setRetenueRetraite(d("600"));
        s.setRetenueAmo(d("180"));
        s.setRetenueMutuelle(d("150"));
        s.setRetenueIr(d("900"));
        s.setAutresRetenues(d("70"));

        s.recomputeNet();

        assertEquals(0, d("9300").compareTo(s.getTotalGains()));
        assertEquals(0, d("1900").compareTo(s.getTotalRetenues()));
        assertEquals(0, d("7400").compareTo(s.getSalaireNet()));
    }

    @Test
    void legacyPayslipWithoutDetailKeepsStoredNet() {
        // Ancien bulletin : seuls net, alloc, mutuelle et rappel existent
        Salaire s = new Salaire();
        s.setSalaireNet(d("3350"));
        s.setAllocFamiliale(d("300"));
        s.setRetenueMutuelle(d("150"));
        s.setRappel(d("250"));

        assertEquals(0, d("3350").compareTo(s.getSalaireNet()));
        assertEquals(0, d("2950").compareTo(s.getSalaireBaseEffectif())); // 3350 + 150 - 300 - 250
        assertEquals(0, d("3500").compareTo(s.getTotalGains())); // 2950 + 300 + 250
        assertEquals(0, d("150").compareTo(s.getTotalRetenues()));
    }
}
