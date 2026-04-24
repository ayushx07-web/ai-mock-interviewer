package com.mockinterview.repository;

import com.mockinterview.entity.Question;
import com.mockinterview.enums.Difficulty;
import com.mockinterview.enums.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTypeAndDifficultyAndRoleTag(QuestionType type, Difficulty difficulty, String roleTag);
}
