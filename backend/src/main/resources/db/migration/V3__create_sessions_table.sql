CREATE TABLE sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    mode ENUM('SOLO', 'PEER') NOT NULL DEFAULT 'SOLO',
    role_tag VARCHAR(100),
    company_tag VARCHAR(100),
    status ENUM('IN_PROGRESS', 'COMPLETED', 'ABANDONED') NOT NULL DEFAULT 'IN_PROGRESS',
    total_score DECIMAL(5, 2),
    ai_summary TEXT,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_status (status)
);
