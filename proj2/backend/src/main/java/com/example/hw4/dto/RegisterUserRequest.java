package com.example.hw4.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(
        @NotBlank(message = "Username is required")
        @Size(max = 100, message = "Username is too long")
        String username,

        @NotBlank(message = "Password is required")
        @Size(max = 100, message = "Password is too long")
        String password,

        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name is too long")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 100, message = "Last name is too long")
        String lastName,

        @NotBlank(message = "Twitter or social account is required")
        @Size(max = 100, message = "Twitter or social account is too long")
        String twitter,

        @Size(max = 255, message = "Avatar URL is too long")
        String avatarUrl,

        @Size(max = 1000, message = "Notes are too long")
        String notes
) {
}
