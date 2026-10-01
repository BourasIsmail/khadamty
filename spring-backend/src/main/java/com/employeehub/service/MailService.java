package com.employeehub.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Envoyer un email de bienvenue avec les identifiants
    public void sendWelcomeEmail(String to, String firstName, String lastName,
                                 String employeeId, String password, String role) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Bienvenue sur Khadamati — Vos identifiants de connexion");

            String roleLabel = "RH".equals(role) ? "Ressources Humaines" : "Employé";

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
                "Pour votre securite, le changement du mot de passe est obligatoire\n" +
                "lors de votre premiere connexion.\n\n" +
                "Si vous avez des questions, n'hésitez pas à contacter le service RH.\n\n" +
                "Cordialement,\n" +
                "L'équipe Khadamati — Entraide Nationale"
            );
            mailSender.send(message);
            log.info("Email de bienvenue envoyé à {}", to);
        } catch (Exception e) {
            // Ne bloque pas la création du compte ; le mot de passe n'est jamais écrit dans les logs.
            log.error("Email de bienvenue non envoyé à {} : {}", to, e.getMessage());
        }
    }
}
