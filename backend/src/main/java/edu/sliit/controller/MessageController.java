package edu.sliit.controller;

import edu.sliit.dto.request.SendMessageRequestDTO;
import edu.sliit.dto.response.MessageResponseDTO;
import edu.sliit.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDTO> send(@RequestBody SendMessageRequestDTO request) {
        return ResponseEntity.ok(messageService.send(request));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<MessageResponseDTO>> getByEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(messageService.getByEvent(eventId));
    }
}
