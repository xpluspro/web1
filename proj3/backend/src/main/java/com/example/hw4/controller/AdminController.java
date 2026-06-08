package com.example.hw4.controller;

import com.example.hw4.dto.BookSalesStatsResponse;
import com.example.hw4.dto.OrderResponse;
import com.example.hw4.dto.UserConsumptionStatsResponse;
import com.example.hw4.service.OrderService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final OrderService orderService;

    public AdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public List<OrderResponse> getAllOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String bookName
    ) {
        return orderService.getAllOrders(startDate, endDate, bookName);
    }

    @GetMapping("/stats/books")
    public List<BookSalesStatsResponse> getBookSalesStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return orderService.getBookSalesStats(startDate, endDate);
    }

    @GetMapping("/stats/users")
    public List<UserConsumptionStatsResponse> getUserConsumptionStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return orderService.getUserConsumptionStats(startDate, endDate);
    }
}
