package com.mockinterview.service;

import com.mockinterview.entity.Question;
import com.mockinterview.enums.Difficulty;
import com.mockinterview.enums.QuestionType;
import com.mockinterview.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<Question> generateQuestionsForSession(String roleTag, String companyTag) {
        List<Question> selectedQuestions = new ArrayList<>();
        
        // Example logic: Select 5 questions mixing types and difficulty based on role
        // For a real app, this should be more sophisticated.
        
        // 1 DSA (Medium)
        addRandomQuestions(selectedQuestions, QuestionType.DSA, Difficulty.MEDIUM, roleTag, 1);
        
        // 1 System Design (Medium/Hard)
        addRandomQuestions(selectedQuestions, QuestionType.SYSTEM_DESIGN, Difficulty.MEDIUM, roleTag, 1);
        
        // 2 Behavioral / HR
        addRandomQuestions(selectedQuestions, QuestionType.BEHAVIORAL, Difficulty.MEDIUM, "ALL", 1);
        addRandomQuestions(selectedQuestions, QuestionType.HR, Difficulty.EASY, "ALL", 1);
        
        // 1 more DSA or depending on role
        addRandomQuestions(selectedQuestions, QuestionType.DSA, Difficulty.EASY, roleTag, 1);

        // If we didn't find enough, just pull some generic ones to ensure we always have 5
        if (selectedQuestions.size() < 5) {
            List<Question> all = questionRepository.findAll();
            Collections.shuffle(all);
            for (Question q : all) {
                if (!selectedQuestions.contains(q)) {
                    selectedQuestions.add(q);
                    if (selectedQuestions.size() == 5) break;
                }
            }
        }
        
        return selectedQuestions;
    }
    
    private void addRandomQuestions(List<Question> selected, QuestionType type, Difficulty difficulty, String roleTag, int count) {
        List<Question> potentials = questionRepository.findByTypeAndDifficultyAndRoleTag(type, difficulty, roleTag);
        if (potentials.isEmpty()) {
            potentials = questionRepository.findByTypeAndDifficultyAndRoleTag(type, difficulty, "ALL");
        }
        if (!potentials.isEmpty()) {
            Collections.shuffle(potentials);
            selected.addAll(potentials.subList(0, Math.min(count, potentials.size())));
        }
    }
}
