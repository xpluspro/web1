package com.example.hw4.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long bookId,
        String title,
        String author,
        BigDecimal price,
        String cover,
        int stock,
        int quantity,
        BigDecimal subtotal
) {
}
