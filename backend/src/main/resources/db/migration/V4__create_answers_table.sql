CREATE TABLE answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer_text TEXT,
    audio_url VARCHAR(500),
    score DECIMAL(5, 2),
    ai_feedback TEXT,
    filler_count INT DEFAULT 0,
    duration_secs INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answers_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE RESTRICT,
    INDEX idx_answers_session_id (session_id)
);
