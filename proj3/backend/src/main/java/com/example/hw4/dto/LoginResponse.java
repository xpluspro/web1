package com.example.hw4.dto;

public record LoginResponse(
        String token,
        UserResponse user
) {
}
