package com.example.hw4.controller;

import com.example.hw4.dto.AddCartItemRequest;
import com.example.hw4.dto.CartResponse;
import com.example.hw4.dto.UpdateCartItemRequest;
import com.example.hw4.security.AccessControlService;
import com.example.hw4.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/{userId}/cart")
public class CartController {

    private final CartService cartService;
    private final AccessControlService accessControlService;

    public CartController(CartService cartService, AccessControlService accessControlService) {
        this.cartService = cartService;
        this.accessControlService = accessControlService;
    }

    @GetMapping
    public CartResponse getCart(@PathVariable Long userId) {
        accessControlService.requireSelfOrAdmin(userId);
        return cartService.getCart(userId);
    }

    @PostMapping("/items")
    public CartResponse addItem(
            @PathVariable Long userId,
            @Valid @RequestBody AddCartItemRequest request
    ) {
        accessControlService.requireSelfOrAdmin(userId);
        return cartService.addItem(userId, request);
    }

    @PutMapping("/items/{bookId}")
    public CartResponse updateItem(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        accessControlService.requireSelfOrAdmin(userId);
        return cartService.updateItem(userId, bookId, request);
    }

    @DeleteMapping("/items/{bookId}")
    public CartResponse removeItem(@PathVariable Long userId, @PathVariable Long bookId) {
        accessControlService.requireSelfOrAdmin(userId);
        return cartService.removeItem(userId, bookId);
    }
}
