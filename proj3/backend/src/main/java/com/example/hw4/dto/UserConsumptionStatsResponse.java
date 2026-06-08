package com.example.hw4.dto;

import java.math.BigDecimal;

public record UserConsumptionStatsResponse(
        Long userId,
        String username,
        String fullName,
        int totalQuantity,
        BigDecimal totalAmount
) {
}
