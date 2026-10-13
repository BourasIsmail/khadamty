package com.employeehub.controller;

import com.employeehub.model.User;
import com.employeehub.repository.AttendanceRepository;
import com.employeehub.repository.EmployeeRepository;
import com.employeehub.repository.UserRepository;
import com.employeehub.service.PasswordGeneratorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AdminControllerResetPasswordTest {

    private UserRepository userRepository;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();
    private AdminController controller;
    private User user;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        user = new User("a@b.ma", "old-hash", "Ali", "Alami", User.Role.EMPLOYEE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        controller = new AdminController(userRepository, mock(EmployeeRepository.class),
            mock(AttendanceRepository.class), encoder, new PasswordGeneratorService());
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> body(ResponseEntity<?> r) { return (Map<String, Object>) r.getBody(); }

    @Test
    void generatedPasswordIsReturnedOnceAndStoredHashed() {
        ResponseEntity<?> r = controller.resetPassword(1L, Map.of());

        String generated = (String) body(r).get("temporaryPassword");
        assertNotNull(generated);
        assertTrue(generated.length() >= 8);
        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertNotEquals(generated, saved.getValue().getPassword());           // jamais en clair
        assertTrue(encoder.matches(generated, saved.getValue().getPassword()));
        assertTrue(saved.getValue().isPasswordChangeRequired());              // changement forcé
    }

    @Test
    void adminChosenPasswordIsAppliedAndNotEchoed() {
        ResponseEntity<?> r = controller.resetPassword(1L, Map.of("password", "Choisi-2026!"));

        assertNull(body(r).get("temporaryPassword"));
        assertTrue(encoder.matches("Choisi-2026!", user.getPassword()));
        assertTrue(user.isPasswordChangeRequired());
    }

    @Test
    void tooShortPasswordIsRejectedAndNothingSaved() {
        ResponseEntity<?> r = controller.resetPassword(1L, Map.of("password", "court"));

        assertEquals(400, r.getStatusCode().value());
        verify(userRepository, never()).save(any());
    }

    @Test
    void unknownUserIsNotFound() {
        assertEquals(404, controller.resetPassword(99L, Map.of()).getStatusCode().value());
    }
}
