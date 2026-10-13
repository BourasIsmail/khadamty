package com.employeehub.service;

import com.employeehub.model.Document;
import com.employeehub.model.Employee;
import com.employeehub.model.Grade;
import com.employeehub.model.RetenueLigne;
import com.employeehub.model.Salaire;
import com.lowagie.text.Chunk;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;

@Service
public class PdfGenerationService {

    private final DecimalFormat moneyFormat = new DecimalFormat("#,##0.00");

    public byte[] generatePayslipPdf(Salaire salaire) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        com.lowagie.text.Document pdf = new com.lowagie.text.Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(pdf, out);
        pdf.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        Paragraph title = new Paragraph("BULLETIN DE PAIE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        pdf.add(title);
        pdf.add(new Paragraph("Periode : " + monthLabel(salaire.getMois()) + " " + salaire.getAnnee(), normalFont));
        pdf.add(Chunk.NEWLINE);

        Employee employee = salaire.getEmployee();
        Grade grade = salaire.getGrade();

        PdfPTable identity = new PdfPTable(2);
        identity.setWidthPercentage(100);
        addHeader(identity, "Employeur");
        addHeader(identity, "Employe");
        addCell(identity, "Khadamati - Entraide Nationale");
        addCell(identity, fullName(employee));
        addCell(identity, "Document genere le " + LocalDate.now());
        addCell(identity, "Matricule : " + value(employee != null ? employee.getEmployeeId() : null));
        addCell(identity, "Service RH");
        addCell(identity, "Poste : " + value(employee != null ? employee.getPosition() : null));
        addCell(identity, "");
        addCell(identity, "Departement : " + value(employee != null ? employee.getDepartment() : null));
        addCell(identity, "");
        addCell(identity, "Grade : " + value(grade != null ? grade.getLibelleFr() : null));
        pdf.add(identity);
        pdf.add(Chunk.NEWLINE);

        BigDecimal net = defaultZero(salaire.getSalaireNet());

        pdf.add(new Paragraph("Remuneration", sectionFont));
        PdfPTable remuneration = amountTable();
        addAmountRow(remuneration, "Salaire de base", salaire.getSalaireBaseEffectif());
        addAmountRowIfPositive(remuneration, "Indemnite de logement", salaire.getIndemniteLogement());
        addAmountRowIfPositive(remuneration, "Indemnite de transport", salaire.getIndemniteTransport());
        addAmountRowIfPositive(remuneration, "Indemnite de fonction", salaire.getIndemniteFonction());
        addAmountRowIfPositive(remuneration, "Primes", salaire.getPrimes());
        addAmountRowIfPositive(remuneration, "Allocations familiales", salaire.getAllocFamiliale());
        addAmountRowIfPositive(remuneration, "Rappel", salaire.getRappel());
        addAmountRow(remuneration, "Total gains", salaire.getTotalGains());
        pdf.add(remuneration);
        pdf.add(Chunk.NEWLINE);

        pdf.add(new Paragraph("Detail des retenues mensuelles - " + monthLabel(salaire.getMois()) + " " + salaire.getAnnee(), sectionFont));
        PdfPTable deductions = new PdfPTable(new float[]{3f, 2f, 2f, 2.4f, 2.2f, 1.6f});
        deductions.setWidthPercentage(100);
        addHeader(deductions, "Type de retenue");
        addHeader(deductions, "Retenue mensuelle");
        addHeader(deductions, "N° dossier");
        addHeader(deductions, "Montant total du pret");
        addHeader(deductions, "Montant restant");
        addHeader(deductions, "Mois restants");
        if (salaire.getRetenues().isEmpty()) {
            PdfPCell none = new PdfPCell(new Phrase("Aucune retenue ce mois-ci", FontFactory.getFont(FontFactory.HELVETICA, 10)));
            none.setColspan(6);
            none.setPadding(6);
            deductions.addCell(none);
        }
        for (RetenueLigne ligne : salaire.getRetenues()) {
            addCell(deductions, ligne.getType());
            addCell(deductions, money(ligne.getMontant()) + " MAD");
            addCell(deductions, ligne.getNumeroDossier() == null ? "" : ligne.getNumeroDossier());
            addCell(deductions, ligne.getMontantTotal() == null ? "" : money(ligne.getMontantTotal()) + " MAD");
            addCell(deductions, ligne.getMontantRestant() == null ? "" : money(ligne.getMontantRestant()) + " MAD");
            addCell(deductions, ligne.getMoisRestants() == null ? "" : String.valueOf(ligne.getMoisRestants()));
        }
        PdfPCell totalLabel = new PdfPCell(new Phrase("Total retenues", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        totalLabel.setPadding(6);
        deductions.addCell(totalLabel);
        PdfPCell totalValue = new PdfPCell(new Phrase(money(salaire.getTotalRetenues()) + " MAD", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        totalValue.setPadding(6);
        totalValue.setColspan(5);
        deductions.addCell(totalValue);
        pdf.add(deductions);
        pdf.add(Chunk.NEWLINE);

        PdfPTable netTable = amountTable();
        addHeader(netTable, "Net a payer");
        addHeader(netTable, money(net) + " MAD");
        pdf.add(netTable);
        pdf.add(Chunk.NEWLINE);

        pdf.add(new Paragraph("Ce bulletin est genere automatiquement par Khadamati.", normalFont));
        pdf.close();
        return out.toByteArray();
    }

    public byte[] generateDocumentSummaryPdf(Document document) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        com.lowagie.text.Document pdf = new com.lowagie.text.Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(pdf, out);
        pdf.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        Paragraph title = new Paragraph(value(document.getTitre()), titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        pdf.add(title);
        pdf.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        addCell(table, "Reference");
        addCell(table, value(document.getNumeroReference()));
        addCell(table, "Date publication");
        addCell(table, value(document.getDatePublication()));
        addCell(table, "Publie par");
        addCell(table, value(document.getPubliePar()));
        addCell(table, "Fichier source");
        addCell(table, value(document.getNomFichier()));
        addCell(table, "Description");
        addCell(table, value(document.getDescription()));
        pdf.add(table);
        pdf.add(Chunk.NEWLINE);
        pdf.add(new Paragraph("Document telecharge au format PDF depuis Khadamati.", normalFont));
        pdf.close();
        return out.toByteArray();
    }

    private PdfPTable amountTable() {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        return table;
    }

    private void addAmountRowIfPositive(PdfPTable table, String label, BigDecimal amount) {
        if (amount != null && amount.signum() > 0) addAmountRow(table, label, amount);
    }

    private void addAmountRow(PdfPTable table, String label, BigDecimal amount) {
        addCell(table, label);
        addCell(table, money(amount) + " MAD");
    }

    private void addHeader(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(value(text), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        cell.setBackgroundColor(new Color(235, 239, 245));
        cell.setPadding(6);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(value(text), FontFactory.getFont(FontFactory.HELVETICA, 10)));
        cell.setPadding(6);
        table.addCell(cell);
    }

    private String fullName(Employee employee) {
        if (employee == null) return "N/A";
        return value(employee.getFirstName()) + " " + value(employee.getLastName());
    }

    private String monthLabel(Byte monthNumber) {
        if (monthNumber == null || monthNumber < 1 || monthNumber > 12) return "Mois inconnu";
        String[] months = {
            "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
        };
        return months[monthNumber - 1];
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String money(BigDecimal value) {
        return moneyFormat.format(defaultZero(value));
    }

    private String value(Object value) {
        return value == null ? "N/A" : String.valueOf(value);
    }
}
