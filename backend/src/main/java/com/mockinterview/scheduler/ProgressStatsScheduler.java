package com.mockinterview.scheduler;

import com.mockinterview.service.ProgressStatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProgressStatsScheduler {

    private final ProgressStatsService progressStatsService;

    // Every Sunday at 11pm
    @Scheduled(cron = "0 0 23 * * SUN")
    public void computeWeeklyStats() {
        log.info("Starting scheduled weekly progress stats computation...");
        try {
            progressStatsService.computeWeeklyStats();
            log.info("Finished scheduled weekly progress stats computation.");
        } catch (Exception e) {
            log.error("Error during scheduled weekly progress stats computation", e);
        }
    }
}
