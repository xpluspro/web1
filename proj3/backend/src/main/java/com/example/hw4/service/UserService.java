package com.example.hw4.service;

import com.example.hw4.dto.RegisterUserRequest;
import com.example.hw4.dto.RegisterUserResponse;
import com.example.hw4.dto.LoginRequest;
import com.example.hw4.dto.UserStatusRequest;
import com.example.hw4.dto.UserResponse;
import java.util.List;

public interface UserService {

    /**
     * Authenticates a user and returns the role-aware session profile used by the frontend.
     */
    UserResponse login(LoginRequest request);

    /**
     * Registers a new customer after validating unique username, unique email, password match, and email format.
     */
    RegisterUserResponse register(RegisterUserRequest request);

    /**
     * Lists all users so administrators can review customer status and roles.
     */
    List<UserResponse> getUsers();

    /**
     * Enables or disables a user account for administrator user management.
     */
    UserResponse updateUserStatus(Long userId, UserStatusRequest request);
}
