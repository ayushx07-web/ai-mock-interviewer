package com.mockinterview.controller;

import com.mockinterview.dto.response.ApiResponse;
import com.mockinterview.dto.response.ProgressStatsResponse;
import com.mockinterview.service.ProgressStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
public class ProgressStatsController {

    private final ProgressStatsService progressStatsService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProgressStatsResponse>>> getMyProgressStats() {
        List<ProgressStatsResponse> response = progressStatsService.getMyProgressStats();
        return ResponseEntity.ok(ApiResponse.success(response, "Progress stats fetched successfully"));
    }

    @PostMapping("/compute")
    public ResponseEntity<ApiResponse<String>> triggerComputeStats() {
        progressStatsService.computeWeeklyStats();
        return ResponseEntity.ok(ApiResponse.success("Success", "Weekly stats computed manually"));
    }
}
