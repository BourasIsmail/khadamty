package com.employeehub.config;

import com.employeehub.model.Employee;
import com.employeehub.repository.EmployeeRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Identité de l'appelant, lue depuis le contexte de sécurité (JWT validé par JwtRequestFilter).
 * "Staff" = ADMIN ou RH ; tout autre rôle (EMPLOYEE) est limité à ses propres données.
 */
@Component
public class CurrentUser {

    private final EmployeeRepository employeeRepository;

    public CurrentUser(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public boolean isStaff() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream().anyMatch(a ->
            a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_RH"));
    }

    /** Profil employé de l'appelant (résolu par email), s'il existe. */
    public Optional<Employee> employee() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return Optional.empty();
        return employeeRepository.findByEmail(auth.getName());
    }

    /** Vrai si l'employé {@code id} est l'appelant. */
    public boolean isSelf(Long employeeId) {
        return employeeId != null && employee().map(e -> employeeId.equals(e.getId())).orElse(false);
    }
}
