package com.example.hw4.service.impl;

import com.example.hw4.dto.LoginRequest;
import com.example.hw4.dto.RegisterUserRequest;
import com.example.hw4.dto.RegisterUserResponse;
import com.example.hw4.dto.UserStatusRequest;
import com.example.hw4.dto.UserResponse;
import com.example.hw4.entity.User;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.exception.ResourceNotFoundException;
import com.example.hw4.repository.UserRepository;
import com.example.hw4.service.UserService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private static final String ADMIN_ROLE = "ADMIN";
    private static final String CUSTOMER_ROLE = "CUSTOMER";

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> new BadRequestException("Username or password is incorrect"));

        if (user.isDisabled()) {
            throw new BadRequestException("您的账号已经被禁用");
        }

        if (!user.getPassword().equals(request.password())) {
            throw new BadRequestException("Username or password is incorrect");
        }

        return toUserResponse(user);
    }

    @Override
    public RegisterUserResponse register(RegisterUserRequest request) {
        String username = request.username().trim();
        String email = request.email().trim();

        if (!request.password().equals(request.confirmPassword())) {
            throw new BadRequestException("The two passwords do not match");
        }

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(request.password().trim());
        user.setEmail(email);
        user.setFirstName(valueOrDefault(request.firstName(), username));
        user.setLastName(valueOrDefault(request.lastName(), "Reader"));
        user.setTwitter(valueOrDefault(request.twitter(), "@" + username));
        user.setAvatarUrl(request.avatarUrl());
        user.setNotes(request.notes());
        user.setRole(username.equalsIgnoreCase("admin") ? ADMIN_ROLE : CUSTOMER_ROLE);
        user.setDisabled(false);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return new RegisterUserResponse(
                savedUser.getId(),
                "User registered successfully",
                savedUser.getFirstName() + " " + savedUser.getLastName()
        );
    }

    @Override
    public List<UserResponse> getUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Override
    public UserResponse updateUserStatus(Long userId, UserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setDisabled(request.disabled());
        return toUserResponse(userRepository.save(user));
    }

    private String valueOrDefault(String source, String fallback) {
        if (source == null || source.trim().isEmpty()) {
            return fallback;
        }

        return source.trim();
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getTwitter(),
                user.getAvatarUrl(),
                user.getNotes(),
                user.getRole() == null ? CUSTOMER_ROLE : user.getRole(),
                user.isDisabled(),
                user.getFirstName() + " " + user.getLastName()
        );
    }
}
