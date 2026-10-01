package com.employeehub.repository;

import com.employeehub.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    List<LeaveRequest> findByEmployeeId(String employeeId);
    
    List<LeaveRequest> findByStatus(LeaveRequest.LeaveStatus status);
    
    List<LeaveRequest> findByLeaveType(LeaveRequest.LeaveType leaveType);
    
    List<LeaveRequest> findByEmployeeIdAndStatus(String employeeId, LeaveRequest.LeaveStatus status);
    
    List<LeaveRequest> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    List<LeaveRequest> findByStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        List<LeaveRequest.LeaveStatus> statuses, LocalDate endDate, LocalDate startDate);
    
    List<LeaveRequest> findByEmployeeIdAndStartDateBetween(
        String employeeId, LocalDate startDate, LocalDate endDate);
}
