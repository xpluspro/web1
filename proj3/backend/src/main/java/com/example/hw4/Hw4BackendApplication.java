package com.example.hw4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class Hw4BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(Hw4BackendApplication.class, args);
    }
}
