package edu.sliit.service.impl;

import edu.sliit.dto.response.CalendarEntryDTO;
import edu.sliit.repository.MilestoneRepository;
import edu.sliit.repository.TaskRepository;
import edu.sliit.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CalendarServiceImpl implements CalendarService {

    private final TaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;

    @Override
    public List<CalendarEntryDTO> getCalendarForEvent(Integer eventId) {
        List<CalendarEntryDTO> entries = new ArrayList<>();

        taskRepository.findByEventId(eventId).forEach(t -> entries.add(
                CalendarEntryDTO.builder()
                        .type("TASK")
                        .id(t.getId())
                        .title(t.getTitle())
                        .date(t.getDueDate())
                        .priority(t.getPriority().name())
                        .status(t.getStatus().name())
                        .build()));

        milestoneRepository.findByEventId(eventId).forEach(m -> entries.add(
                CalendarEntryDTO.builder()
                        .type("MILESTONE")
                        .id(m.getId())
                        .title(m.getName())
                        .date(m.getDueDate())
                        .build()));

        entries.sort(Comparator.comparing(CalendarEntryDTO::getDate));
        return entries;
    }
}
