package com.mockinterview.controller;

import com.mockinterview.dto.request.CreateSessionRequest;
import com.mockinterview.dto.response.ApiResponse;
import com.mockinterview.dto.response.SessionDetailResponse;
import com.mockinterview.dto.response.SessionResponse;
import com.mockinterview.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<ApiResponse<SessionResponse>> createSession(@Valid @RequestBody CreateSessionRequest request) {
        SessionResponse response = sessionService.createSession(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Session created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SessionResponse>>> getMySessions() {
        List<SessionResponse> response = sessionService.getMySessions();
        return ResponseEntity.ok(ApiResponse.success(response, "Sessions fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SessionDetailResponse>> getSession(@PathVariable Long id) {
        SessionDetailResponse response = sessionService.getSession(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Session details fetched successfully"));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<SessionResponse>> completeSession(@PathVariable Long id) {
        SessionResponse response = sessionService.completeSession(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Session completed successfully"));
    }
}
