package com.mockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionDetailResponse {
    private SessionResponse session;
    private List<AnswerResponse> answers;
}
