package com.mockinterview.entity;

import com.mockinterview.enums.Difficulty;
import com.mockinterview.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(name = "role_tag")
    private String roleTag;

    @Column(name = "company_tag")
    private String companyTag;

    @Column(name = "expected_answer", columnDefinition = "TEXT")
    private String expectedAnswer;

    @Column(name = "scoring_rubric", columnDefinition = "json")
    private String scoringRubric;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
