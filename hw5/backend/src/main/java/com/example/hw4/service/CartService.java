package com.example.hw4.service;

import com.example.hw4.dto.AddCartItemRequest;
import com.example.hw4.dto.CartResponse;
import com.example.hw4.dto.UpdateCartItemRequest;

public interface CartService {

    CartResponse getCart(Long userId);

    CartResponse addItem(Long userId, AddCartItemRequest request);

    CartResponse updateItem(Long userId, Long bookId, UpdateCartItemRequest request);

    CartResponse removeItem(Long userId, Long bookId);
}
