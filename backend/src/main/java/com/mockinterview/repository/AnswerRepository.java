package com.mockinterview.repository;

import com.mockinterview.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findBySessionId(Long sessionId);

    @Query("SELECT AVG(a.score) FROM Answer a JOIN a.session s WHERE s.user.id = :userId")
    Double findAvgScoreByUserId(@Param("userId") Long userId);
}
