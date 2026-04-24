package com.mockinterview.dto.request;

import com.mockinterview.enums.SessionMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSessionRequest {
    
    @NotNull(message = "Session mode is required")
    private SessionMode mode;

    @NotBlank(message = "Role tag is required")
    private String roleTag;

    @NotBlank(message = "Company tag is required")
    private String companyTag;
}
