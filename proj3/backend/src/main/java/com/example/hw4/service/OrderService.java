package com.example.hw4.service;

import com.example.hw4.dto.BookSalesStatsResponse;
import com.example.hw4.dto.CustomerStatsResponse;
import com.example.hw4.dto.OrderResponse;
import com.example.hw4.dto.UserConsumptionStatsResponse;
import java.time.LocalDate;
import java.util.List;

public interface OrderService {

    /**
     * Returns one customer's orders, optionally filtered by date range and purchased book title.
     */
    List<OrderResponse> getOrders(Long userId, LocalDate startDate, LocalDate endDate, String bookName);

    /**
     * Returns all orders for administrator review, optionally filtered by date range and purchased book title.
     */
    List<OrderResponse> getAllOrders(LocalDate startDate, LocalDate endDate, String bookName);

    /**
     * Converts a customer's cart into a paid order, deducts stock, and clears the cart.
     */
    OrderResponse checkout(Long userId);

    /**
     * Aggregates book sales in a date range for the administrator hot-sales leaderboard.
     */
    List<BookSalesStatsResponse> getBookSalesStats(LocalDate startDate, LocalDate endDate);

    /**
     * Aggregates customer spending in a date range for the administrator consumption leaderboard.
     */
    List<UserConsumptionStatsResponse> getUserConsumptionStats(LocalDate startDate, LocalDate endDate);

    /**
     * Aggregates one customer's purchased books, total quantity, and total amount in a date range.
     */
    CustomerStatsResponse getCustomerStats(Long userId, LocalDate startDate, LocalDate endDate);
}
