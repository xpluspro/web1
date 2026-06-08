package com.example.hw4.service;

import com.example.hw4.dto.OrderResponse;
import java.util.List;

public interface OrderService {

    List<OrderResponse> getOrders(Long userId);

    OrderResponse checkout(Long userId);
}
