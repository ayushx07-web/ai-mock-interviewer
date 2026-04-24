package com.mockinterview.dto.response;

import com.mockinterview.enums.SessionMode;
import com.mockinterview.enums.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionResponse {
    private Long id;
    private Long userId;
    private SessionMode mode;
    private SessionStatus status;
    private String roleTag;
    private String companyTag;
    private BigDecimal totalScore;
    private String aiSummary;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
