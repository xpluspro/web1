package com.example.hw4.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.hw4.dto.LoginRequest;
import com.example.hw4.dto.RegisterUserRequest;
import com.example.hw4.entity.User;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void shouldCreateCustomerWhenPasswordsAndEmailAreValid() {
        RegisterUserRequest request = new RegisterUserRequest(
                "alice",
                "123456",
                "123456",
                "alice@example.com",
                "Alice",
                "Reader",
                "@Alice",
                "",
                "unit test"
        );
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getRole()).isEqualTo("CUSTOMER");
        assertThat(savedUser.isDisabled()).isFalse();
        assertThat(savedUser.getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void shouldRejectRegisterWhenPasswordsDoNotMatch() {
        RegisterUserRequest request = new RegisterUserRequest(
                "alice",
                "123456",
                "654321",
                "alice@example.com",
                "Alice",
                "Reader",
                "@Alice",
                "",
                "unit test"
        );

        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("The two passwords do not match");
    }

    @Test
    void shouldRejectDisabledUserLoginWithRequiredChineseMessage() {
        User disabledUser = new User();
        disabledUser.setUsername("disabled");
        disabledUser.setPassword("123456");
        disabledUser.setEmail("disabled@example.com");
        disabledUser.setFirstName("Disabled");
        disabledUser.setLastName("Reader");
        disabledUser.setTwitter("@Disabled");
        disabledUser.setRole("CUSTOMER");
        disabledUser.setDisabled(true);
        disabledUser.setCreatedAt(LocalDateTime.now());
        when(userRepository.findByUsername("disabled")).thenReturn(Optional.of(disabledUser));

        assertThatThrownBy(() -> userService.login(new LoginRequest("disabled", "123456")))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("您的账号已经被禁用");
    }
}
