package com.employeehub.dto;

public class LoginResponse {
    
    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private boolean passwordChangeRequired;
    
    // Constructeurs
    public LoginResponse() {}
    
    public LoginResponse(String token, String id, String email, String firstName, 
                        String lastName, String role) {
        this(token, id, email, firstName, lastName, role, false);
    }

    public LoginResponse(String token, String id, String email, String firstName,
                        String lastName, String role, boolean passwordChangeRequired) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.passwordChangeRequired = passwordChangeRequired;
    }
    
    // Getters et Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isPasswordChangeRequired() { return passwordChangeRequired; }
    public void setPasswordChangeRequired(boolean passwordChangeRequired) { this.passwordChangeRequired = passwordChangeRequired; }
}
