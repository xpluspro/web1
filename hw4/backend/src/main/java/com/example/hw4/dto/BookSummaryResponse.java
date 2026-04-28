package com.example.hw4.dto;

import java.math.BigDecimal;

public record BookSummaryResponse(
        Long id,
        String slug,
        String title,
        String author,
        String publisher,
        String category,
        BigDecimal price,
        String status,
        String cover,
        String summary
) {
}
