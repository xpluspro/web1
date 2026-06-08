package com.example.hw4.service.impl;

import com.example.hw4.dto.OrderItemResponse;
import com.example.hw4.dto.OrderResponse;
import com.example.hw4.entity.Book;
import com.example.hw4.entity.BookOrder;
import com.example.hw4.entity.CartItem;
import com.example.hw4.entity.OrderItem;
import com.example.hw4.entity.User;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.exception.ResourceNotFoundException;
import com.example.hw4.repository.BookOrderRepository;
import com.example.hw4.repository.CartItemRepository;
import com.example.hw4.repository.UserRepository;
import com.example.hw4.service.OrderService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

    private static final String PAID_STATUS = "PAID";

    private final BookOrderRepository bookOrderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(
            BookOrderRepository bookOrderRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository
    ) {
        this.bookOrderRepository = bookOrderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(Long userId) {
        ensureUserExists(userId);
        return bookOrderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse checkout(Long userId) {
        User user = getUser(userId);
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByUpdatedAtDesc(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Shopping cart is empty");
        }

        BookOrder order = new BookOrder();
        order.setUser(user);
        order.setStatus(PAID_STATUS);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Book book = cartItem.getBook();
            BigDecimal subtotal = book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(subtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setBook(book);
            orderItem.setTitle(book.getTitle());
            orderItem.setAuthor(book.getAuthor());
            orderItem.setUnitPrice(book.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSubtotal(subtotal);
            order.addItem(orderItem);
        }

        order.setTotalAmount(total);
        BookOrder savedOrder = bookOrderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);

        return toOrderResponse(savedOrder);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    private void ensureUserExists(Long userId) {
        getUser(userId);
    }

    private OrderResponse toOrderResponse(BookOrder order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(this::toOrderItemResponse)
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                items
        );
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getBook().getId(),
                item.getTitle(),
                item.getAuthor(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getSubtotal()
        );
    }
}
