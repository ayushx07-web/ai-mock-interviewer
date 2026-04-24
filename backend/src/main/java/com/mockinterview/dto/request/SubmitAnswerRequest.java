package com.mockinterview.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitAnswerRequest {
    
    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String answerText;
    private String audioUrl;
    
    private Integer durationSecs = 0;
    private Integer fillerCount = 0;
}
