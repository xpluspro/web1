package com.example.hw4.security;

public record AuthenticatedUser(
        Long id,
        String username,
        String role
) {

    public boolean isAdmin() {
        return "ADMIN".equals(role);
    }
}
