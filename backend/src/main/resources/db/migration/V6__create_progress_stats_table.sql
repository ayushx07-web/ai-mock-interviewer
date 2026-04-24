CREATE TABLE progress_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    week_start DATE NOT NULL,
    sessions_count INT DEFAULT 0,
    avg_score DECIMAL(5, 2),
    avg_filler_count DECIMAL(5, 2),
    best_category VARCHAR(50),
    weak_category VARCHAR(50),
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_progress_user_week (user_id, week_start),
    INDEX idx_progress_user_id (user_id)
);
