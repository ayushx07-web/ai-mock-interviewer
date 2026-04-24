package com.mockinterview.mapper;

import com.mockinterview.dto.response.ProgressStatsResponse;
import com.mockinterview.entity.ProgressStats;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProgressStatsMapper {
    @Mapping(target = "userId", source = "user.id")
    ProgressStatsResponse toResponse(ProgressStats stats);
    
    List<ProgressStatsResponse> toResponseList(List<ProgressStats> statsList);
}
