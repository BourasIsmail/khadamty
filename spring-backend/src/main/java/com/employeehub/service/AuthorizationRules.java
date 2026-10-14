package com.employeehub.service;

import com.employeehub.model.LeaveRequest;
import com.employeehub.model.LeaveRequest.LeaveStatus;
import com.employeehub.model.LeaveRequest.LeaveType;

import java.time.LocalDate;
import java.util.List;

/** Règles de gestion des autorisations (durées maximales, Hajj, sans traitement). */
public final class AuthorizationRules {

    private AuthorizationRules() {}

    /**
     * @param history demandes déjà déposées par l'employé
     * @return message d'erreur, ou null si la demande est acceptable
     */
    public static String check(LeaveType type, int days, LocalDate start, LocalDate end,
                               List<LeaveRequest> history) {
        if (type == null) return "Type d'autorisation obligatoire";
        if (!type.isSelectable()) return "Ce type d'autorisation n'est plus proposé";
        if (days < 1) return "La durée doit être d'au moins un jour";
        if (start != null && end != null && end.isBefore(start)) {
            return "La date de fin doit être postérieure à la date de début";
        }
        if (type.getMaxDays() != null && days > type.getMaxDays()) {
            return type.getDisplayName() + " : durée maximale " + type.getMaxDays() + " jours";
        }
        List<LeaveRequest> active = history.stream()
                .filter(r -> r.getStatus() == LeaveStatus.PENDING || r.getStatus() == LeaveStatus.APPROVED)
                .toList();
        if (type == LeaveType.HAJJ_LEAVE
                && active.stream().anyMatch(r -> r.getLeaveType() == LeaveType.HAJJ_LEAVE)) {
            return "L'autorisation de pèlerinage n'est accordée qu'une seule fois";
        }
        if (type == LeaveType.UNPAID_LEAVE && start != null
                && active.stream().anyMatch(r -> r.getLeaveType() == LeaveType.UNPAID_LEAVE
                        && r.getStartDate() != null
                        && r.getStartDate().isAfter(start.minusYears(2))
                        && !r.getStartDate().isAfter(start.plusYears(2)))) {
            return "L'autorisation sans traitement est limitée à un mois tous les deux ans";
        }
        return null;
    }
}
