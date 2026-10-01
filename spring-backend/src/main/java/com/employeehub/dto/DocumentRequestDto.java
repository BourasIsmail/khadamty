package com.employeehub.dto;

import com.employeehub.model.DocumentRequest;
import jakarta.validation.constraints.NotNull;

public class DocumentRequestDto {
    
    @NotNull(message = "Document type is required")
    private DocumentRequest.DocumentType documentType;
    
    private String purpose;
    
    // Constructeurs
    public DocumentRequestDto() {}
    
    // Getters et Setters
    public DocumentRequest.DocumentType getDocumentType() { return documentType; }
    public void setDocumentType(DocumentRequest.DocumentType documentType) { this.documentType = documentType; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}
