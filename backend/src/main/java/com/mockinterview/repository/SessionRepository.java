package com.mockinterview.repository;

import com.mockinterview.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUserIdOrderByStartedAtDesc(Long userId);
    List<Session> findByUserIdAndStartedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
