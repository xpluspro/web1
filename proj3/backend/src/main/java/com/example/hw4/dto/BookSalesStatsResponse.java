package com.example.hw4.dto;

import java.math.BigDecimal;

public record BookSalesStatsResponse(
        Long bookId,
        String title,
        String author,
        String isbn,
        int totalQuantity,
        BigDecimal totalAmount
) {
}
