package com.example.hw4.controller;

import com.example.hw4.dto.LoginRequest;
import com.example.hw4.dto.RegisterUserRequest;
import com.example.hw4.dto.RegisterUserResponse;
import com.example.hw4.dto.UserStatusRequest;
import com.example.hw4.dto.UserResponse;
import com.example.hw4.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterUserResponse register(@Valid @RequestBody RegisterUserRequest request) {
        return userService.register(request);
    }

    @GetMapping
    public List<UserResponse> getUsers() {
        return userService.getUsers();
    }

    @PutMapping("/{userId}/status")
    public UserResponse updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UserStatusRequest request
    ) {
        return userService.updateUserStatus(userId, request);
    }
}
