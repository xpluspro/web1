package com.example.hw4.service;

import com.example.hw4.dto.RegisterUserRequest;
import com.example.hw4.dto.RegisterUserResponse;
import com.example.hw4.dto.LoginRequest;
import com.example.hw4.dto.UserResponse;

public interface UserService {

    UserResponse login(LoginRequest request);

    RegisterUserResponse register(RegisterUserRequest request);
}
