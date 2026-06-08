package com.example.hw4.service;

import com.example.hw4.dto.AddCartItemRequest;
import com.example.hw4.dto.CartResponse;
import com.example.hw4.dto.UpdateCartItemRequest;

public interface CartService {

    /**
     * Returns the current user's shopping cart with item totals and cart total amount.
     */
    CartResponse getCart(Long userId);

    /**
     * Adds a book to the current user's cart or increases the quantity of an existing cart item.
     */
    CartResponse addItem(Long userId, AddCartItemRequest request);

    /**
     * Changes the quantity of one cart item after validating that the item belongs to the user.
     */
    CartResponse updateItem(Long userId, Long bookId, UpdateCartItemRequest request);

    /**
     * Removes one book from the current user's cart.
     */
    CartResponse removeItem(Long userId, Long bookId);
}
