package com.mockinterview.service;

import com.mockinterview.dto.request.CreateSessionRequest;
import com.mockinterview.dto.response.SessionDetailResponse;
import com.mockinterview.dto.response.SessionResponse;
import com.mockinterview.entity.Answer;
import com.mockinterview.entity.Question;
import com.mockinterview.entity.Session;
import com.mockinterview.entity.User;
import com.mockinterview.enums.SessionMode;
import com.mockinterview.enums.SessionStatus;
import com.mockinterview.exception.BadRequestException;
import com.mockinterview.exception.ResourceNotFoundException;
import com.mockinterview.mapper.AnswerMapper;
import com.mockinterview.mapper.SessionMapper;
import com.mockinterview.repository.AnswerRepository;
import com.mockinterview.repository.SessionRepository;
import com.mockinterview.service.ai.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionService questionService;
    private final SessionMapper sessionMapper;
    private final AnswerMapper answerMapper;
    private final AuthService authService;
    private final GeminiService geminiService;

    @Transactional
    public SessionResponse createSession(CreateSessionRequest request) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new BadRequestException("User not authenticated");
        }

        Session session = Session.builder()
                .user(currentUser)
                .mode(request.getMode() != null ? request.getMode() : SessionMode.SOLO)
                .roleTag(request.getRoleTag())
                .companyTag(request.getCompanyTag())
                .status(SessionStatus.IN_PROGRESS)
                .build();
        
        session = sessionRepository.save(session);

        List<Question> questions = questionService.generateQuestionsForSession(request.getRoleTag(), request.getCompanyTag());
        
        for (Question question : questions) {
            Answer answer = Answer.builder()
                    .session(session)
                    .question(question)
                    .build();
            answerRepository.save(answer);
        }

        return sessionMapper.toResponse(session);
    }

    public List<SessionResponse> getMySessions() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new BadRequestException("User not authenticated");
        }
        return sessionMapper.toResponseList(sessionRepository.findByUserIdOrderByStartedAtDesc(currentUser.getId()));
    }

    public SessionDetailResponse getSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        // Ensure user is the owner
        User currentUser = authService.getCurrentUser();
        if (currentUser != null && !session.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Not authorized to view this session");
        }
        
        List<Answer> answers = answerRepository.findBySessionId(id);
        
        return SessionDetailResponse.builder()
                .session(sessionMapper.toResponse(session))
                .answers(answerMapper.toResponseList(answers))
                .build();
    }

    @Transactional
    public SessionResponse completeSession(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        if (session.getStatus() == SessionStatus.COMPLETED) {
            throw new BadRequestException("Session already completed");
        }

        List<Answer> answers = answerRepository.findBySessionId(id);
        
        BigDecimal totalScore = BigDecimal.ZERO;
        int count = 0;
        
        StringBuilder answersSummary = new StringBuilder();
        
        for (int i = 0; i < answers.size(); i++) {
            Answer ans = answers.get(i);
            if (ans.getScore() != null) {
                totalScore = totalScore.add(ans.getScore());
                count++;
            }
            answersSummary.append("Q").append(i+1).append(": ").append(ans.getQuestion().getContent()).append("\n");
            answersSummary.append("A").append(i+1).append(": ").append(ans.getAnswerText() != null ? ans.getAnswerText() : "No answer provided.").append("\n");
            answersSummary.append("Score: ").append(ans.getScore()).append("\n\n");
        }
        
        if (count > 0) {
            session.setTotalScore(totalScore.divide(new BigDecimal(count), 2, RoundingMode.HALF_UP));
        } else {
            session.setTotalScore(BigDecimal.ZERO);
        }

        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        
        // Generate AI overall summary
        String prompt = "You are an expert technical interviewer. Based on the following interview transcript and scores, write a professional, constructive 1-paragraph summary of the candidate's performance. Focus on their strengths and areas for improvement. Keep it encouraging but realistic. \n\n" + answersSummary.toString();
        
        String aiSummary = geminiService.generateSummary(prompt);
        session.setAiSummary(aiSummary);

        session = sessionRepository.save(session);
        return sessionMapper.toResponse(session);
    }
}
