package com.example.hw4.security;

import com.example.hw4.exception.ForbiddenException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AccessControlService {

    public AuthenticatedUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new ForbiddenException("Authentication is required");
        }
        return user;
    }

    public void requireSelfOrAdmin(Long userId) {
        AuthenticatedUser user = currentUser();
        if (!user.isAdmin() && !user.id().equals(userId)) {
            throw new ForbiddenException("You can only access your own data");
        }
    }
}
