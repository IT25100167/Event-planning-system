package edu.sliit.service.impl;

import edu.sliit.dto.request.SendMessageRequestDTO;
import edu.sliit.dto.response.MessageResponseDTO;
import edu.sliit.entity.MessageEntity;
import edu.sliit.repository.MessageRepository;
import edu.sliit.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class MessageServiceImpl implements MessageService {

    private static final Set<String> ROLES = Set.of("COORDINATOR", "CUSTOMER", "VENDOR");

    private final MessageRepository messageRepository;

    @Override
    public MessageResponseDTO send(SendMessageRequestDTO request) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }
        if (request.getSenderName() == null || request.getSenderName().isBlank()) {
            throw new IllegalArgumentException("Sender name is required");
        }
        if (!ROLES.contains(request.getSenderRole())) {
            throw new IllegalArgumentException("Role must be COORDINATOR, CUSTOMER or VENDOR");
        }
        MessageEntity saved = messageRepository.save(MessageEntity.builder()
                .eventId(request.getEventId())
                .senderName(request.getSenderName())
                .senderRole(request.getSenderRole())
                .content(request.getContent())
                .build());
        return toDto(saved);
    }

    @Override
    public List<MessageResponseDTO> getByEvent(Integer eventId) {
        return messageRepository.findByEventIdOrderBySentAtAsc(eventId).stream().map(this::toDto).toList();
    }

    private MessageResponseDTO toDto(MessageEntity m) {
        return MessageResponseDTO.builder()
                .id(m.getId())
                .eventId(m.getEventId())
                .senderName(m.getSenderName())
                .senderRole(m.getSenderRole())
                .content(m.getContent())
                .sentAt(m.getSentAt())
                .build();
    }
}
