package com.employeehub.service;

import com.employeehub.model.Employee;
import com.employeehub.model.RetenueLigne;
import com.employeehub.model.Salaire;
import com.employeehub.repository.EmployeeRepository;
import com.employeehub.repository.GradeRepository;
import com.employeehub.repository.SalaireRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SalaireServiceTest {

    private SalaireRepository salaireRepository;
    private EmployeeRepository employeeRepository;
    private SalaireService service;
    private Employee employee;

    private static BigDecimal d(String v) { return new BigDecimal(v); }

    @BeforeEach
    void setUp() {
        salaireRepository = mock(SalaireRepository.class);
        employeeRepository = mock(EmployeeRepository.class);
        service = new SalaireService();
        ReflectionTestUtils.setField(service, "salaireRepository", salaireRepository);
        ReflectionTestUtils.setField(service, "employeeRepository", employeeRepository);
        ReflectionTestUtils.setField(service, "gradeRepository", mock(GradeRepository.class));
        employee = new Employee();
        employee.setId(7L);
        when(employeeRepository.findById(7L)).thenReturn(Optional.of(employee));
        when(salaireRepository.save(any(Salaire.class))).thenAnswer(i -> i.getArgument(0));
    }

    private Salaire newSalaire(RetenueLigne... lignes) {
        Employee ref = new Employee();
        ref.setId(7L);
        Salaire s = new Salaire();
        s.setEmployee(ref);
        s.setAnnee((short) 2026);
        s.setMois((byte) 10);
        s.setSalaireBase(d("8000"));
        s.setPrimes(d("200"));
        s.setRetenues(List.of(lignes));
        return s;
    }

    @Test
    void createComputesNetFromGainsAndDeductionLines() {
        RetenueLigne pret = new RetenueLigne("Crédit bancaire", d("1200"));
        pret.setNumeroDossier(" D-42 ");
        pret.setMoisRestants(10);

        Salaire saved = service.createSalaire(newSalaire(new RetenueLigne("Mutuelle", d("150")), pret));

        assertEquals(0, d("8200").compareTo(saved.getTotalGains()));
        assertEquals(0, d("1350").compareTo(saved.getTotalRetenues()));
        assertEquals(0, d("6850").compareTo(saved.getSalaireNet()));
        assertEquals("D-42", saved.getRetenues().get(1).getNumeroDossier());
        assertSame(saved, saved.getRetenues().get(0).getSalaire());
    }

    @Test
    void blankLinesAreIgnoredButATypelessAmountIsRejected() {
        Salaire ok = service.createSalaire(newSalaire(new RetenueLigne("", BigDecimal.ZERO), new RetenueLigne("Mutuelle", d("100"))));
        assertEquals(1, ok.getRetenues().size());

        assertThrows(RuntimeException.class, () -> service.createSalaire(newSalaire(new RetenueLigne(" ", d("50")))));
    }

    @Test
    void deductionsLargerThanGainsAreRejected() {
        assertThrows(RuntimeException.class,
            () -> service.createSalaire(newSalaire(new RetenueLigne("Crédit", d("9000")))));
    }

    @Test
    void updatingALegacyPayslipReplacesItsOldFixedDeductions() {
        Salaire existing = new Salaire();
        existing.setId("s1");
        existing.setEmployee(employee);
        existing.setAnnee((short) 2026);
        existing.setMois((byte) 9);
        existing.setSalaireNet(d("3350"));
        existing.setRetenueMutuelle(d("150"));   // ancien format : pas de lignes
        when(salaireRepository.findById("s1")).thenReturn(Optional.of(existing));

        // l'admin supprime toute retenue
        Salaire update = new Salaire();
        update.setSalaireBase(d("3500"));

        Salaire saved = service.updateSalaire("s1", update);

        assertTrue(saved.getRetenues().isEmpty());              // l'ancienne mutuelle ne réapparaît pas
        assertEquals(0, d("3500").compareTo(saved.getSalaireNet()));
    }
}
