package com.example.hw4.service;

import com.example.hw4.dto.RegisterUserRequest;
import com.example.hw4.dto.RegisterUserResponse;
import com.example.hw4.entity.User;
import com.example.hw4.repository.UserRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RegisterUserResponse register(RegisterUserRequest request) {
        User user = new User();
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
}
