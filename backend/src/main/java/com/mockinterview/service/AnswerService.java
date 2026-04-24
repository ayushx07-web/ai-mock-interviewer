package com.mockinterview.service;

import com.mockinterview.dto.request.SubmitAnswerRequest;
import com.mockinterview.dto.response.AnswerResponse;
import com.mockinterview.entity.Answer;
import com.mockinterview.entity.Question;
import com.mockinterview.exception.BadRequestException;
import com.mockinterview.exception.ResourceNotFoundException;
import com.mockinterview.mapper.AnswerMapper;
import com.mockinterview.repository.AnswerRepository;
import com.mockinterview.service.ai.AiScoringResponse;
import com.mockinterview.service.ai.GeminiService;
import com.mockinterview.service.ai.WhisperService;
import com.mockinterview.service.storage.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final GeminiService geminiService;
    private final WhisperService whisperService;
    private final CloudinaryService cloudinaryService;
    private final AnswerMapper answerMapper;

    public Map<String, String> transcribeAndUploadAudio(MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            throw new BadRequestException("Audio file is required");
        }
        
        String audioUrl = cloudinaryService.uploadAudio(audioFile);
        String transcript = whisperService.transcribeAudio(audioFile);

        Map<String, String> result = new HashMap<>();
        result.put("audioUrl", audioUrl);
        result.put("transcript", transcript);
        return result;
    }

    @Transactional
    public AnswerResponse submitAnswer(Long sessionId, SubmitAnswerRequest request) {
        Answer answer = answerRepository.findBySessionId(sessionId).stream()
                .filter(a -> a.getQuestion().getId().equals(request.getQuestionId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Answer record not found for this session and question"));

        if (answer.getScore() != null) {
            throw new BadRequestException("Answer has already been submitted and scored");
        }

        answer.setAnswerText(request.getAnswerText());
        answer.setAudioUrl(request.getAudioUrl());
        answer.setDurationSecs(request.getDurationSecs());
        answer.setFillerCount(request.getFillerCount());

        Question question = answer.getQuestion();
        String answerToScore = request.getAnswerText();
        
        if (answerToScore == null || answerToScore.trim().isEmpty()) {
            answer.setScore(BigDecimal.ZERO);
            answer.setAiFeedback("No answer provided.");
        } else {
            AiScoringResponse aiResponse = geminiService.scoreAnswer(
                    question.getContent(),
                    question.getScoringRubric(),
                    answerToScore
            );

            answer.setScore(new BigDecimal(aiResponse.getScore()));
            answer.setAiFeedback(aiResponse.getFeedback() + 
                "\nKeywords Covered: " + String.join(", ", aiResponse.getKeywords_covered()) +
                "\nKeywords Missed: " + String.join(", ", aiResponse.getKeywords_missed()));
        }

        answer = answerRepository.save(answer);
        return answerMapper.toResponse(answer);
    }
}
