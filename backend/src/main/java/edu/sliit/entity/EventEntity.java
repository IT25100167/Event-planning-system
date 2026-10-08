package edu.sliit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "events")
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer eventId;

    @Column(name = "event_name", nullable = false)
    private String eventName;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status;

    @ManyToOne
    @JoinColumn(name = "coordinator_id", nullable = false)
    private UserEntity coordinator;

    @Column(name = "notes", length = 500)
    private String notes;
}