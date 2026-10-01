package com.employeehub.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final JavaMailSender mailSender;

    // Stockage en mémoire : email → {code, expiration}
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private static final int OTP_EXPIRY_MINUTES = 5;

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Générer et envoyer le code OTP
    public void generateAndSendOtp(String email, String firstName) {
        String code = generateCode();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
        otpStore.put(email, new OtpEntry(code, expiry));
        sendEmail(email, firstName, code);
    }

    // Vérifier le code OTP
    public boolean verifyOtp(String email, String code) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) return false;
        if (LocalDateTime.now().isAfter(entry.expiry())) {
            otpStore.remove(email);
            return false;
        }
        if (entry.code().equals(code)) {
            otpStore.remove(email); // Code utilisé une seule fois
            return true;
        }
        return false;
    }

    // Générer un code à 6 chiffres
    private String generateCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    // Envoyer l'email
    private void sendEmail(String to, String firstName, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Khadamati — Code de vérification");
            message.setText(
                "Bonjour " + firstName + ",\n\n" +
                "Votre code de vérification pour accéder à Khadamati est :\n\n" +
                "    " + code + "\n\n" +
                "Ce code est valable pendant " + OTP_EXPIRY_MINUTES + " minutes.\n\n" +
                "Si vous n'avez pas demandé ce code, ignorez cet email.\n\n" +
                "Cordialement,\n" +
                "L'équipe Khadamati — Entraide Nationale"
            );
            mailSender.send(message);
        } catch (Exception e) {
            // Log l'erreur mais ne bloque pas le flux
            System.err.println("Erreur envoi email OTP: " + e.getMessage());
            // En développement, afficher le code dans les logs
            System.out.println(">>> CODE OTP pour " + to + " : " + code + " <<<");
        }
    }

    // Envoyer un email de bienvenue avec les identifiants
    public void sendWelcomeEmail(String to, String firstName, String lastName, 
                                 String employeeId, String password, String role) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Bienvenue sur Khadamati — Vos identifiants de connexion");
            
            String roleLabel = role.equals("RH") ? "Ressources Humaines" : "Employé";
            
            message.setText(
                "Bonjour " + firstName + " " + lastName + ",\n\n" +
                "Bienvenue sur Khadamati, la plateforme RH de l'Entraide Nationale !\n\n" +
                "Votre compte a été créé avec succès. Voici vos identifiants de connexion :\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "  ID Employé : " + employeeId + "\n" +
                "  Email      : " + to + "\n" +
                "  Mot de passe : " + password + "\n" +
                "  Type de compte : " + roleLabel + "\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Vous pouvez vous connecter sur : http://localhost:3000\n\n" +
                "Pour votre securite, le changement du mot de passe est obligatoire\n" +
                "lors de votre premiere connexion.\n\n" +
                "Si vous avez des questions, n'hésitez pas à contacter le service RH.\n\n" +
                "Cordialement,\n" +
                "L'équipe Khadamati — Entraide Nationale"
            );
            mailSender.send(message);
            System.out.println("✅ Email de bienvenue envoyé à " + to);
        } catch (Exception e) {
            // Log l'erreur mais ne bloque pas le flux
            System.err.println("❌ Erreur envoi email de bienvenue: " + e.getMessage());
            // En développement, afficher les identifiants dans les logs
            System.out.println("═══════════════════════════════════════════════");
            System.out.println("📧 NOUVEAU COMPTE CRÉÉ");
            System.out.println("═══════════════════════════════════════════════");
            System.out.println("Nom: " + firstName + " " + lastName);
            System.out.println("Email: " + to);
            System.out.println("ID Employé: " + employeeId);
            System.out.println("Mot de passe: " + password);
            System.out.println("Rôle: " + (role.equals("RH") ? "RH (Ressources Humaines)" : "Employé"));
            System.out.println("═══════════════════════════════════════════════");
        }
    }

    // Classe interne pour stocker le code et son expiration
    private record OtpEntry(String code, LocalDateTime expiry) {}
}
