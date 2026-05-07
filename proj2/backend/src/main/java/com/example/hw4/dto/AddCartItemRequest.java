package com.example.hw4.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
        @NotNull(message = "Book id is required")
        Long bookId,

        @Min(value = 1, message = "Quantity must be at least 1")
        int quantity
) {
}
