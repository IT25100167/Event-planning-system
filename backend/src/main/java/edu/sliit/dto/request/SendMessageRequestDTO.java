package edu.sliit.dto.request;

import lombok.Data;

@Data
public class SendMessageRequestDTO {
    private Integer eventId;
    private String senderName;
    private String senderRole;
    private String content;
}
