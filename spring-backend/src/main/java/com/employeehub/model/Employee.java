package com.employeehub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(unique = true)
    private String email;
    
    private String phone;
    private String department;
    private String position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "structure_id")
    private Structure structure;
    
    @Column(name = "hire_date")
    private LocalDate hireDate;
    
    @JsonIgnore
    private Double salary;
    
    // Champs pour la gestion des congés
    @Column(name = "annual_leave_balance")
    private Integer annualLeaveBalance;
    
    @Column(name = "sick_leave_balance")
    private Integer sickLeaveBalance;
    
    @Column(name = "personal_leave_balance")
    private Integer personalLeaveBalance;
    
    private String address;
    
    @Column(name = "emergency_contact")
    private String emergencyContact;
    
    @Column(name = "emergency_phone")
    private String emergencyPhone;
    
    private String status;
    
    @Column(name = "is_active")
    private boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructeurs
    public Employee() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
        this.status = "active";
        // Soldes par défaut (en jours)
        this.annualLeaveBalance = 25;
        this.sickLeaveBalance = 10;
        this.personalLeaveBalance = 5;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public Structure getStructure() { return structure; }
    public void setStructure(Structure structure) { this.structure = structure; }

    public String getStructureId() {
        return structure != null ? structure.getId() : null;
    }

    public String getStructureLibelle() {
        return structure != null ? structure.getNomFr() : department;
    }

    public String getStructurePath() {
        if (structure == null) return department;

        java.util.LinkedList<String> parts = new java.util.LinkedList<>();
        Structure current = structure;
        int guard = 0;
        while (current != null && guard < 20) {
            if (current.getNomFr() != null && !current.getNomFr().isBlank()) {
                parts.addFirst(current.getNomFr());
            }
            current = current.getParent();
            guard++;
        }
        return String.join(" / ", parts);
    }
    
    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
    
    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
    
    public Integer getAnnualLeaveBalance() { return annualLeaveBalance; }
    public void setAnnualLeaveBalance(Integer annualLeaveBalance) { this.annualLeaveBalance = annualLeaveBalance; }
    
    public Integer getSickLeaveBalance() { return sickLeaveBalance; }
    public void setSickLeaveBalance(Integer sickLeaveBalance) { this.sickLeaveBalance = sickLeaveBalance; }
    
    public Integer getPersonalLeaveBalance() { return personalLeaveBalance; }
    public void setPersonalLeaveBalance(Integer personalLeaveBalance) { this.personalLeaveBalance = personalLeaveBalance; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    
    public String getEmergencyPhone() { return emergencyPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
