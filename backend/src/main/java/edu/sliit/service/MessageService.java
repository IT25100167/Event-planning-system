package edu.sliit.service;

import edu.sliit.dto.request.SendMessageRequestDTO;
import edu.sliit.dto.response.MessageResponseDTO;

import java.util.List;

public interface MessageService {
    MessageResponseDTO send(SendMessageRequestDTO request);
    List<MessageResponseDTO> getByEvent(Integer eventId);
}
