package com.example.hw4.dto;

import java.math.BigDecimal;
import java.util.List;

public record CustomerStatsResponse(
        List<BookPurchaseStatsResponse> books,
        int totalQuantity,
        BigDecimal totalAmount
) {
}
