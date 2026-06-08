package com.example.hw4.dto;

public record UserResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String twitter,
        String avatarUrl,
        String notes,
        String fullName
) {
}
