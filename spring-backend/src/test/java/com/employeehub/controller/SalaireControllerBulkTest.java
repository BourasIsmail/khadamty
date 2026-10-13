package com.employeehub.controller;

import com.employeehub.model.Salaire;
import com.employeehub.service.SalaireService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class SalaireControllerBulkTest {

    @Mock SalaireService salaireService;
    @InjectMocks SalaireController controller;

    @Test
    void oneInvalidRowDoesNotBlockTheOthers() {
        Salaire ok1 = new Salaire(), bad = new Salaire(), ok2 = new Salaire();
        doThrow(new RuntimeException("Un bulletin existe déjà pour cet employé et cette période"))
            .when(salaireService).createSalaire(bad);

        ResponseEntity<?> response = controller.createBulk(List.of(ok1, bad, ok2));

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(200, response.getStatusCode().value());
        assertEquals(3, body.get("total"));
        assertEquals(2, body.get("created"));
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> failed = (List<Map<String, Object>>) body.get("failed");
        assertEquals(1, failed.size());
        assertEquals(1, failed.get(0).get("index"));
        verify(salaireService, times(3)).createSalaire(any(Salaire.class));
    }

    @Test
    void emptyListIsRejected() {
        assertEquals(400, controller.createBulk(List.of()).getStatusCode().value());
    }
}
