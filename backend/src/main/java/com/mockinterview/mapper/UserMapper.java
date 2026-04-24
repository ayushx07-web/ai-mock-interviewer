package com.mockinterview.mapper;

import com.mockinterview.entity.User;
import com.mockinterview.dto.response.UserResponse;
import com.mockinterview.dto.request.RegisterRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true) // Set manually in service with encoder
    User toEntity(RegisterRequest request);
}
