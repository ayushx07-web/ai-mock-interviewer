package com.mockinterview.dto.response;

import com.mockinterview.enums.Difficulty;
import com.mockinterview.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {
    private Long id;
    private String content;
    private QuestionType type;
    private Difficulty difficulty;
    private String roleTag;
    private String companyTag;
}
