package com.mockinterview.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "progress_stats", uniqueConstraints = {
    @UniqueConstraint(name = "uq_progress_user_week", columnNames = {"user_id", "week_start"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "week_start", nullable = false)
    private LocalDate weekStart;

    @Column(name = "sessions_count")
    private Integer sessionsCount = 0;

    @Column(name = "avg_score")
    private BigDecimal avgScore;

    @Column(name = "avg_filler_count")
    private BigDecimal avgFillerCount;

    @Column(name = "best_category", length = 50)
    private String bestCategory;

    @Column(name = "weak_category", length = 50)
    private String weakCategory;
}
