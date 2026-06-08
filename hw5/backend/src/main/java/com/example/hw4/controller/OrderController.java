package com.example.hw4.controller;

import com.example.hw4.dto.OrderResponse;
import com.example.hw4.service.OrderService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> getOrders(@PathVariable Long userId) {
        return orderService.getOrders(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@PathVariable Long userId) {
        return orderService.checkout(userId);
    }
}
