package com.mockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressStatsResponse {
    private Long id;
    private Long userId;
    private LocalDate weekStart;
    private Integer sessionsCount;
    private BigDecimal avgScore;
    private BigDecimal avgFillerCount;
    private String bestCategory;
    private String weakCategory;
}
