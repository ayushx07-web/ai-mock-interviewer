package com.mockinterview.controller;

import com.mockinterview.dto.request.SubmitAnswerRequest;
import com.mockinterview.dto.response.ApiResponse;
import com.mockinterview.dto.response.AnswerResponse;
import com.mockinterview.service.AnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/sessions/{sessionId}/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<ApiResponse<AnswerResponse>> submitAnswer(
            @PathVariable Long sessionId,
            @Valid @RequestBody SubmitAnswerRequest request) {
        AnswerResponse response = answerService.submitAnswer(sessionId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Answer submitted and scored successfully"));
    }
}
