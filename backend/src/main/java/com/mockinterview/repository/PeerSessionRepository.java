package com.mockinterview.repository;

import com.mockinterview.entity.PeerSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PeerSessionRepository extends JpaRepository<PeerSession, Long> {
    Optional<PeerSession> findByInviteCode(String inviteCode);
}
