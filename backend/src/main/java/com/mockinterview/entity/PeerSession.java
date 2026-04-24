package com.mockinterview.entity;

import com.mockinterview.enums.PeerStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "peer_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeerSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_a_id", nullable = false)
    private Session sessionA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_b_id")
    private Session sessionB;

    @Column(name = "invite_code", nullable = false, unique = true, length = 12)
    private String inviteCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PeerStatus status = PeerStatus.WAITING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
