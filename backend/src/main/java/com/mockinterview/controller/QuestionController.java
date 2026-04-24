package com.mockinterview.controller;

import com.mockinterview.dto.response.ApiResponse;
import com.mockinterview.dto.response.QuestionResponse;
import com.mockinterview.mapper.QuestionMapper;
import com.mockinterview.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final QuestionMapper questionMapper;

    @GetMapping("/generate")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> generateQuestions(
            @RequestParam String roleTag, 
            @RequestParam String companyTag) {
        List<QuestionResponse> response = questionMapper.toResponseList(
                questionService.generateQuestionsForSession(roleTag, companyTag));
        return ResponseEntity.ok(ApiResponse.success(response, "Questions generated successfully"));
    }
}
