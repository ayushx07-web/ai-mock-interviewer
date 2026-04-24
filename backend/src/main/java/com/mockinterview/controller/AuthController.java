package com.mockinterview.controller;

import com.mockinterview.dto.request.LoginRequest;
import com.mockinterview.dto.request.RegisterRequest;
import com.mockinterview.dto.response.ApiResponse;
import com.mockinterview.dto.response.AuthResponse;
import com.mockinterview.dto.response.UserResponse;
import com.mockinterview.mapper.UserMapper;
import com.mockinterview.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse response = userMapper.toResponse(authService.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success(response, "Current user fetched successfully"));
    }
}
