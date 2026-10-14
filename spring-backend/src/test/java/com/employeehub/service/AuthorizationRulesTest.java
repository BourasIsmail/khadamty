package com.employeehub.service;

import com.employeehub.model.LeaveRequest;
import com.employeehub.model.LeaveRequest.LeaveStatus;
import com.employeehub.model.LeaveRequest.LeaveType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AuthorizationRulesTest {

    private static final LocalDate START = LocalDate.of(2026, 3, 2);

    private static LeaveRequest past(LeaveType type, LocalDate start, LeaveStatus status) {
        LeaveRequest r = new LeaveRequest();
        r.setLeaveType(type);
        r.setStartDate(start);
        r.setStatus(status);
        return r;
    }

    @Test
    void acceptsAnnualWithinLimit() {
        assertNull(AuthorizationRules.check(LeaveType.ANNUAL_LEAVE, 22, START, START.plusDays(21), List.of()));
    }

    @Test
    void rejectsExceptionalOverTenDays() {
        assertNotNull(AuthorizationRules.check(LeaveType.EXCEPTIONAL_LEAVE, 11, START, START.plusDays(10), List.of()));
        assertNull(AuthorizationRules.check(LeaveType.EXCEPTIONAL_LEAVE, 10, START, START.plusDays(9), List.of()));
    }

    @Test
    void hajjOnlyOnce() {
        var history = List.of(past(LeaveType.HAJJ_LEAVE, LocalDate.of(2020, 5, 1), LeaveStatus.APPROVED));
        assertNotNull(AuthorizationRules.check(LeaveType.HAJJ_LEAVE, 30, START, START.plusDays(29), history));
        var rejected = List.of(past(LeaveType.HAJJ_LEAVE, LocalDate.of(2020, 5, 1), LeaveStatus.REJECTED));
        assertNull(AuthorizationRules.check(LeaveType.HAJJ_LEAVE, 30, START, START.plusDays(29), rejected));
    }

    @Test
    void unpaidOncePerTwoYears() {
        var recent = List.of(past(LeaveType.UNPAID_LEAVE, START.minusMonths(10), LeaveStatus.APPROVED));
        assertNotNull(AuthorizationRules.check(LeaveType.UNPAID_LEAVE, 20, START, START.plusDays(19), recent));
        var old = List.of(past(LeaveType.UNPAID_LEAVE, START.minusYears(3), LeaveStatus.APPROVED));
        assertNull(AuthorizationRules.check(LeaveType.UNPAID_LEAVE, 20, START, START.plusDays(19), old));
    }

    @Test
    void rejectsLegacyTypesAndBadDates() {
        assertNotNull(AuthorizationRules.check(LeaveType.PERSONAL_LEAVE, 2, START, START.plusDays(1), List.of()));
        assertNotNull(AuthorizationRules.check(LeaveType.ANNUAL_LEAVE, 0, START, START, List.of()));
        assertNotNull(AuthorizationRules.check(LeaveType.ANNUAL_LEAVE, 2, START, START.minusDays(1), List.of()));
    }

    @Test
    void maternityIs14WeeksAndPaternity15Days() {
        assertNull(AuthorizationRules.check(LeaveType.MATERNITY, 98, START, START.plusDays(97), List.of()));
        assertNotNull(AuthorizationRules.check(LeaveType.MATERNITY, 99, START, START.plusDays(98), List.of()));
        assertNotNull(AuthorizationRules.check(LeaveType.PATERNITY, 16, START, START.plusDays(15), List.of()));
    }
}
