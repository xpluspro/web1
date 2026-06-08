package com.example.hw4.service.impl;

import com.example.hw4.dto.AddCartItemRequest;
import com.example.hw4.dto.CartItemResponse;
import com.example.hw4.dto.CartResponse;
import com.example.hw4.dto.UpdateCartItemRequest;
import com.example.hw4.entity.Book;
import com.example.hw4.entity.CartItem;
import com.example.hw4.entity.User;
import com.example.hw4.exception.ResourceNotFoundException;
import com.example.hw4.repository.BookRepository;
import com.example.hw4.repository.CartItemRepository;
import com.example.hw4.repository.UserRepository;
import com.example.hw4.service.CartService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(
            CartItemRepository cartItemRepository,
            BookRepository bookRepository,
            UserRepository userRepository
    ) {
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        ensureUserExists(userId);
        return toCartResponse(cartItemRepository.findByUserIdOrderByUpdatedAtDesc(userId));
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, AddCartItemRequest request) {
        User user = getUser(userId);
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + request.bookId()));

        CartItem item = cartItemRepository.findByUserIdAndBookId(userId, request.bookId())
                .orElseGet(CartItem::new);

        if (item.getId() == null) {
            item.setUser(user);
            item.setBook(book);
            item.setQuantity(0);
        }

        item.setQuantity(item.getQuantity() + request.quantity());
        item.setUpdatedAt(LocalDateTime.now());
        cartItemRepository.save(item);

        return getCart(userId);
    }

    @Override
    @Transactional
    public CartResponse updateItem(Long userId, Long bookId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setQuantity(request.quantity());
        item.setUpdatedAt(LocalDateTime.now());
        cartItemRepository.save(item);

        return getCart(userId);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long bookId) {
        ensureUserExists(userId);
        cartItemRepository.deleteByUserIdAndBookId(userId, bookId);
        return getCart(userId);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    private void ensureUserExists(Long userId) {
        getUser(userId);
    }

    private CartResponse toCartResponse(List<CartItem> items) {
        List<CartItemResponse> itemResponses = items.stream()
                .map(this::toCartItemResponse)
                .toList();
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(itemResponses, totalAmount);
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        Book book = item.getBook();
        BigDecimal subtotal = book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                item.getId(),
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPrice(),
                book.getCover(),
                item.getQuantity(),
                subtotal
        );
    }
}
