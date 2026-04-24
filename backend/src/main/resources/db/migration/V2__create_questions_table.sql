CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    type ENUM('DSA', 'HR', 'SYSTEM_DESIGN', 'BEHAVIORAL') NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    role_tag VARCHAR(100),
    company_tag VARCHAR(100),
    expected_answer TEXT,
    scoring_rubric JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_role_tag (role_tag),
    INDEX idx_questions_company_tag (company_tag),
    INDEX idx_questions_type_difficulty (type, difficulty)
);
