package com.mockinterview.mapper;

import com.mockinterview.entity.Answer;
import com.mockinterview.dto.response.AnswerResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {QuestionMapper.class})
public interface AnswerMapper {

    @Mapping(target = "sessionId", source = "session.id")
    AnswerResponse toResponse(Answer answer);

    List<AnswerResponse> toResponseList(List<Answer> answers);
}
