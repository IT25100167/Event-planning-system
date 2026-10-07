package edu.sliit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Integer id;
    private Integer eventId;
    private String senderName;
    private String senderRole;
    private String content;
    private LocalDateTime sentAt;
}
