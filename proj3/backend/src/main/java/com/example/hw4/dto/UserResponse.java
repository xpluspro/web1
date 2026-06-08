package com.example.hw4.dto;

public record UserResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String twitter,
        String avatarUrl,
        String notes,
        String role,
        boolean disabled,
        String fullName
) {
}
