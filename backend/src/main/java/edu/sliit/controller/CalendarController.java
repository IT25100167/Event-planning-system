package edu.sliit.controller;

import edu.sliit.dto.response.CalendarEntryDTO;
import edu.sliit.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<CalendarEntryDTO>> getCalendar(@PathVariable Integer eventId) {
        return ResponseEntity.ok(calendarService.getCalendarForEvent(eventId));
    }
}