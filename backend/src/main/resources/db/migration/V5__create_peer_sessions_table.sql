CREATE TABLE peer_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_a_id BIGINT NOT NULL,
    session_b_id BIGINT,
    invite_code VARCHAR(12) NOT NULL UNIQUE,
    status ENUM('WAITING', 'ACTIVE', 'DONE') NOT NULL DEFAULT 'WAITING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_peer_session_a FOREIGN KEY (session_a_id) REFERENCES sessions(id),
    CONSTRAINT fk_peer_session_b FOREIGN KEY (session_b_id) REFERENCES sessions(id)
);
