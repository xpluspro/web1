package com.example.hw4.dto;

import java.math.BigDecimal;

public record BookPurchaseStatsResponse(
        Long bookId,
        String title,
        String author,
        int quantity,
        BigDecimal totalAmount
) {
}
