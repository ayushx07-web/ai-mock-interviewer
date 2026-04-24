package com.mockinterview.mapper;

import com.mockinterview.entity.Session;
import com.mockinterview.dto.response.SessionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SessionMapper {
    
    @Mapping(target = "userId", source = "user.id")
    SessionResponse toResponse(Session session);
    
    List<SessionResponse> toResponseList(List<Session> sessions);
}
