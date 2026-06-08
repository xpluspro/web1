package com.example.hw4.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long bookId,
        String title,
        String author,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal subtotal
) {
}
