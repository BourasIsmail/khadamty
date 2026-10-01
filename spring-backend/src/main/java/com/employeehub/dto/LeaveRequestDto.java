package com.employeehub.dto;

import com.employeehub.model.LeaveRequest;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class LeaveRequestDto {
    
    @NotNull(message = "Leave type is required")
    private LeaveRequest.LeaveType leaveType;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    @NotNull(message = "Days requested is required")
    private Integer daysRequested;
    
    private String reason;
    
    // Constructeurs
    public LeaveRequestDto() {}
    
    // Getters et Setters
    public LeaveRequest.LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveRequest.LeaveType leaveType) { this.leaveType = leaveType; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public Integer getDaysRequested() { return daysRequested; }
    public void setDaysRequested(Integer daysRequested) { this.daysRequested = daysRequested; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
