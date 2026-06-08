package com.example.hw4.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        String username,
        String userFullName,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
}
