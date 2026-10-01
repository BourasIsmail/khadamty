package com.employeehub.service;

import com.employeehub.model.NoteAnnuelle;
import com.employeehub.repository.NoteAnnuelleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NoteAnnuelleService {

    @Autowired
    private NoteAnnuelleRepository noteAnnuelleRepository;

    public NoteAnnuelle createNoteAnnuelle(NoteAnnuelle note) { return noteAnnuelleRepository.save(note); }

    public List<NoteAnnuelle> getAllNotesAnnuelles() { return noteAnnuelleRepository.findAll(); }

    public Optional<NoteAnnuelle> getNoteAnnuelleById(String id) { return noteAnnuelleRepository.findById(id); }

    public List<NoteAnnuelle> getNotesByEmployee(String employeeId) {
        try { return noteAnnuelleRepository.findByEmployeeId(Long.parseLong(employeeId)); }
        catch (NumberFormatException e) { return List.of(); }
    }

    public List<NoteAnnuelle> getNotesByYear(Integer annee) {
        return noteAnnuelleRepository.findAll().stream()
            .filter(n -> n.getAnnee() != null && n.getAnnee().intValue() == annee)
            .toList();
    }

    public NoteAnnuelle updateNoteAnnuelle(String id, NoteAnnuelle details) {
        NoteAnnuelle note = noteAnnuelleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note non trouvée: " + id));
        note.setEmployee(details.getEmployee());
        note.setSaisiePar(details.getSaisiePar());
        note.setAnnee(details.getAnnee());
        note.setNote(details.getNote());
        note.setAppreciation(details.getAppreciation());
        return noteAnnuelleRepository.save(note);
    }

    public void deleteNoteAnnuelle(String id) { noteAnnuelleRepository.deleteById(id); }
}
