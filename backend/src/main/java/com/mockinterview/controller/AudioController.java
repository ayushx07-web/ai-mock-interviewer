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
@RequestMapping("/answers")
@RequiredArgsConstructor
public class AudioController {

    private final AnswerService answerService;

    @PostMapping("/transcribe")
    public ResponseEntity<ApiResponse<Map<String, String>>> transcribe(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = answerService.transcribeAndUploadAudio(file);
        return ResponseEntity.ok(ApiResponse.success(response, "Audio transcribed successfully"));
    }
}
