package com.mockinterview.dto.response;

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
public class AnswerResponse {
    private Long id;
    private Long sessionId;
    private QuestionResponse question;
    private String answerText;
    private String audioUrl;
    private BigDecimal score;
    private String aiFeedback;
    private Integer fillerCount;
    private Integer durationSecs;
    private LocalDateTime createdAt;
}
