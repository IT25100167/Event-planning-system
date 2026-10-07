package edu.sliit.service;

import edu.sliit.dto.response.CalendarEntryDTO;

import java.util.List;

public interface CalendarService {
    List<CalendarEntryDTO> getCalendarForEvent(Integer eventId);
}
