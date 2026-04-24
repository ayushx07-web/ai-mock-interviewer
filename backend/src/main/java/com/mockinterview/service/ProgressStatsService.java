package com.mockinterview.service;

import com.mockinterview.dto.response.ProgressStatsResponse;
import com.mockinterview.entity.Answer;
import com.mockinterview.entity.ProgressStats;
import com.mockinterview.entity.Session;
import com.mockinterview.entity.User;
import com.mockinterview.enums.QuestionType;
import com.mockinterview.enums.SessionStatus;
import com.mockinterview.mapper.ProgressStatsMapper;
import com.mockinterview.repository.AnswerRepository;
import com.mockinterview.repository.ProgressStatsRepository;
import com.mockinterview.repository.SessionRepository;
import com.mockinterview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProgressStatsService {

    private final ProgressStatsRepository progressStatsRepository;
    private final SessionRepository sessionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final ProgressStatsMapper progressStatsMapper;
    private final AuthService authService;

    public List<ProgressStatsResponse> getMyProgressStats() {
        User currentUser = authService.getCurrentUser();
        // Return all stats for the user, perhaps ordered
        List<ProgressStats> stats = progressStatsRepository.findAll().stream()
                .filter(s -> s.getUser().getId().equals(currentUser.getId()))
                .sorted((a, b) -> b.getWeekStart().compareTo(a.getWeekStart()))
                .collect(Collectors.toList());
        return progressStatsMapper.toResponseList(stats);
    }

    @Transactional
    public void computeWeeklyStats() {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).atTime(LocalTime.MAX);
        
        log.info("Computing weekly stats for week starting: {}", monday);
        
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            List<Session> weeklySessions = sessionRepository.findByUserIdAndStartedAtBetween(
                    user.getId(), startOfWeek, endOfWeek);
            
            List<Session> completedSessions = weeklySessions.stream()
                    .filter(s -> s.getStatus() == SessionStatus.COMPLETED)
                    .collect(Collectors.toList());
                    
            if (completedSessions.isEmpty()) {
                continue; // No completed sessions this week, optionally we could record 0s
            }
            
            int sessionsCount = completedSessions.size();
            
            BigDecimal totalSessionScore = BigDecimal.ZERO;
            int totalFillers = 0;
            int answeredQuestionsCount = 0;
            
            Map<QuestionType, BigDecimal> categoryScores = new HashMap<>();
            Map<QuestionType, Integer> categoryCounts = new HashMap<>();
            
            for (Session session : completedSessions) {
                totalSessionScore = totalSessionScore.add(session.getTotalScore() != null ? session.getTotalScore() : BigDecimal.ZERO);
                
                List<Answer> answers = answerRepository.findBySessionId(session.getId());
                for (Answer answer : answers) {
                    if (answer.getScore() != null) {
                        QuestionType type = answer.getQuestion().getType();
                        categoryScores.put(type, categoryScores.getOrDefault(type, BigDecimal.ZERO).add(answer.getScore()));
                        categoryCounts.put(type, categoryCounts.getOrDefault(type, 0) + 1);
                        
                        totalFillers += answer.getFillerCount() != null ? answer.getFillerCount() : 0;
                        answeredQuestionsCount++;
                    }
                }
            }
            
            BigDecimal avgScore = totalSessionScore.divide(new BigDecimal(sessionsCount), 2, RoundingMode.HALF_UP);
            BigDecimal avgFillers = answeredQuestionsCount > 0 
                    ? new BigDecimal(totalFillers).divide(new BigDecimal(answeredQuestionsCount), 2, RoundingMode.HALF_UP) 
                    : BigDecimal.ZERO;
                    
            String bestCategory = null;
            String weakCategory = null;
            BigDecimal highestAvg = BigDecimal.valueOf(-1);
            BigDecimal lowestAvg = BigDecimal.valueOf(101); // max score is 100
            
            for (Map.Entry<QuestionType, Integer> entry : categoryCounts.entrySet()) {
                QuestionType type = entry.getKey();
                int count = entry.getValue();
                BigDecimal avgCatScore = categoryScores.get(type).divide(new BigDecimal(count), 2, RoundingMode.HALF_UP);
                
                if (avgCatScore.compareTo(highestAvg) > 0) {
                    highestAvg = avgCatScore;
                    bestCategory = type.name();
                }
                if (avgCatScore.compareTo(lowestAvg) < 0) {
                    lowestAvg = avgCatScore;
                    weakCategory = type.name();
                }
            }
            
            ProgressStats stats = progressStatsRepository.findByUserIdAndWeekStart(user.getId(), monday)
                    .orElse(ProgressStats.builder()
                            .user(user)
                            .weekStart(monday)
                            .build());
                            
            stats.setSessionsCount(sessionsCount);
            stats.setAvgScore(avgScore);
            stats.setAvgFillerCount(avgFillers);
            stats.setBestCategory(bestCategory);
            stats.setWeakCategory(weakCategory);
            
            progressStatsRepository.save(stats);
            log.info("Saved progress stats for user {}", user.getEmail());
        }
    }
}
