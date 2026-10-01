package com.employeehub.service;

import com.employeehub.model.Document;
import com.employeehub.model.Employee;
import com.employeehub.model.Grade;
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
import java.math.RoundingMode;
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
        BigDecimal allocFamiliale = defaultZero(salaire.getAllocFamiliale());
        BigDecimal retenueMutuelle = defaultZero(salaire.getRetenueMutuelle());
        BigDecimal rappel = defaultZero(salaire.getRappel());
        BigDecimal salaireBase = net.add(retenueMutuelle).subtract(allocFamiliale).subtract(rappel);
        if (salaireBase.compareTo(BigDecimal.ZERO) < 0) {
            salaireBase = BigDecimal.ZERO;
        }
        BigDecimal totalGains = salaireBase.add(allocFamiliale).add(rappel);

        pdf.add(new Paragraph("Remuneration", sectionFont));
        PdfPTable remuneration = amountTable();
        addAmountRow(remuneration, "Salaire de base estime", salaireBase);
        addAmountRow(remuneration, "Allocations familiales", allocFamiliale);
        addAmountRow(remuneration, "Rappel", rappel);
        addAmountRow(remuneration, "Total gains", totalGains);
        pdf.add(remuneration);
        pdf.add(Chunk.NEWLINE);

        pdf.add(new Paragraph("Retenues", sectionFont));
        PdfPTable deductions = amountTable();
        addAmountRow(deductions, "Retenue mutuelle", retenueMutuelle);
        addAmountRow(deductions, "Total retenues", retenueMutuelle);
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

    public byte[] generateEmployeePayslipPdf(Employee employee, Integer annee, Integer mois) {
        BigDecimal net = BigDecimal.valueOf(employee.getSalary() != null ? employee.getSalary() : 0)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal retenueMutuelle = net.multiply(new BigDecimal("0.04")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal salaireBase = net.add(retenueMutuelle);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        com.lowagie.text.Document pdf = new com.lowagie.text.Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(pdf, out);
        pdf.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        Paragraph title = new Paragraph("BULLETIN DE PAIE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        pdf.add(title);
        pdf.add(new Paragraph("Periode : " + monthLabel(mois.byteValue()) + " " + annee, normalFont));
        pdf.add(Chunk.NEWLINE);

        PdfPTable identity = new PdfPTable(2);
        identity.setWidthPercentage(100);
        addHeader(identity, "Employeur");
        addHeader(identity, "Employe");
        addCell(identity, "Khadamati - Entraide Nationale");
        addCell(identity, fullName(employee));
        addCell(identity, "Document genere le " + LocalDate.now());
        addCell(identity, "Matricule : " + value(employee.getEmployeeId()));
        addCell(identity, "Service RH");
        addCell(identity, "Poste : " + value(employee.getPosition()));
        addCell(identity, "");
        addCell(identity, "Departement : " + value(employee.getDepartment()));
        pdf.add(identity);
        pdf.add(Chunk.NEWLINE);

        pdf.add(new Paragraph("Remuneration", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        PdfPTable remuneration = amountTable();
        addAmountRow(remuneration, "Salaire de base estime", salaireBase);
        addAmountRow(remuneration, "Total gains", salaireBase);
        pdf.add(remuneration);
        pdf.add(Chunk.NEWLINE);

        pdf.add(new Paragraph("Retenues", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        PdfPTable deductions = amountTable();
        addAmountRow(deductions, "Retenue mutuelle estimee", retenueMutuelle);
        addAmountRow(deductions, "Total retenues", retenueMutuelle);
        pdf.add(deductions);
        pdf.add(Chunk.NEWLINE);

        PdfPTable netTable = amountTable();
        addHeader(netTable, "Net a payer");
        addHeader(netTable, money(net) + " MAD");
        pdf.add(netTable);
        pdf.add(Chunk.NEWLINE);
        pdf.add(new Paragraph("Bulletin genere automatiquement depuis le salaire du profil employe.", normalFont));
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
