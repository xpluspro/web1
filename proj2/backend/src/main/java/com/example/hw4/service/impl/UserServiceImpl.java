package com.example.hw4.service.impl;

import com.example.hw4.dto.LoginRequest;
import com.example.hw4.dto.RegisterUserRequest;
import com.example.hw4.dto.RegisterUserResponse;
import com.example.hw4.dto.UserResponse;
import com.example.hw4.entity.User;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.exception.ResourceNotFoundException;
import com.example.hw4.repository.UserRepository;
import com.example.hw4.service.UserService;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> new BadRequestException("Username or password is incorrect"));

        if (!user.getPassword().equals(request.password())) {
            throw new BadRequestException("Username or password is incorrect");
        }

        return toUserResponse(user);
    }

    @Override
    public RegisterUserResponse register(RegisterUserRequest request) {
        if (userRepository.findByUsername(request.username().trim()).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.username().trim());
        user.setPassword(request.password().trim());
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setTwitter(request.twitter().trim());
        user.setAvatarUrl(request.avatarUrl());
        user.setNotes(request.notes());
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return new RegisterUserResponse(
                savedUser.getId(),
                "User registered successfully",
                savedUser.getFirstName() + " " + savedUser.getLastName()
        );
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getTwitter(),
                user.getAvatarUrl(),
                user.getNotes(),
                user.getFirstName() + " " + user.getLastName()
        );
    }
}
