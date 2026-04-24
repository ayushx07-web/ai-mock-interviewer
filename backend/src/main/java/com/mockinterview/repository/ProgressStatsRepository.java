package com.mockinterview.repository;

import com.mockinterview.entity.ProgressStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ProgressStatsRepository extends JpaRepository<ProgressStats, Long> {
    Optional<ProgressStats> findByUserIdAndWeekStart(Long userId, LocalDate weekStart);
}
