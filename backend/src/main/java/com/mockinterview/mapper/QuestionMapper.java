package com.mockinterview.mapper;

import com.mockinterview.entity.Question;
import com.mockinterview.dto.response.QuestionResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    QuestionResponse toResponse(Question question);
    List<QuestionResponse> toResponseList(List<Question> questions);
}
