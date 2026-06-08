package com.example.hw4.dto;

import java.math.BigDecimal;
import java.util.List;

public record BookDetailResponse(
        Long id,
        String slug,
        String title,
        String author,
        String publisher,
        String category,
        String language,
        String isbn,
        BigDecimal price,
        int stock,
        String status,
        String cover,
        String summary,
        List<String> description,
        List<String> highlights
) {
}
