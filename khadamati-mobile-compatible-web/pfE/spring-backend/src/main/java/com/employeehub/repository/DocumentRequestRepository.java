package com.employeehub.repository;

import com.employeehub.model.DocumentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, Long> {
    
    List<DocumentRequest> findByEmployeeId(String employeeId);
    
    List<DocumentRequest> findByStatus(DocumentRequest.RequestStatus status);
    
    List<DocumentRequest> findByDocumentType(DocumentRequest.DocumentType documentType);
    
    List<DocumentRequest> findByEmployeeIdAndStatus(String employeeId, DocumentRequest.RequestStatus status);
}
