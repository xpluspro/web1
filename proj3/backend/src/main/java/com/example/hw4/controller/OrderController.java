package com.example.hw4.controller;

import com.example.hw4.dto.CustomerStatsResponse;
import com.example.hw4.dto.OrderResponse;
import com.example.hw4.security.AccessControlService;
import com.example.hw4.service.OrderService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/orders")
public class OrderController {

    private final OrderService orderService;
    private final AccessControlService accessControlService;

    public OrderController(OrderService orderService, AccessControlService accessControlService) {
        this.orderService = orderService;
        this.accessControlService = accessControlService;
    }

    @GetMapping
    public List<OrderResponse> getOrders(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String bookName
    ) {
        accessControlService.requireSelfOrAdmin(userId);
        return orderService.getOrders(userId, startDate, endDate, bookName);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@PathVariable Long userId) {
        accessControlService.requireSelfOrAdmin(userId);
        return orderService.checkout(userId);
    }

    @GetMapping("/stats")
    public CustomerStatsResponse getCustomerStats(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        accessControlService.requireSelfOrAdmin(userId);
        return orderService.getCustomerStats(userId, startDate, endDate);
    }

}
