package com.example.hw4.service.impl;

import com.example.hw4.dto.BookPurchaseStatsResponse;
import com.example.hw4.dto.BookSalesStatsResponse;
import com.example.hw4.dto.CustomerStatsResponse;
import com.example.hw4.dto.OrderItemResponse;
import com.example.hw4.dto.OrderResponse;
import com.example.hw4.dto.UserConsumptionStatsResponse;
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
import java.time.LocalDate;
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
    public List<OrderResponse> getOrders(Long userId, LocalDate startDate, LocalDate endDate, String bookName) {
        ensureUserExists(userId);
        return bookOrderRepository.searchOrders(
                        userId,
                        toStartAt(startDate),
                        toEndAt(endDate),
                        normalizeSearch(bookName)
                ).stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(LocalDate startDate, LocalDate endDate, String bookName) {
        return bookOrderRepository.searchOrders(
                        null,
                        toStartAt(startDate),
                        toEndAt(endDate),
                        normalizeSearch(bookName)
                ).stream()
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
            // Stock is checked again during checkout because cart quantities may
            // become stale after another user buys the same book.
            if (cartItem.getQuantity() > book.getStock()) {
                throw new BadRequestException("Insufficient stock for " + book.getTitle());
            }

            book.setStock(book.getStock() - cartItem.getQuantity());
            book.setStatus(book.getStock() > 0 ? book.getStatus() : "Out of Stock");

            BigDecimal subtotal = book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(subtotal);

            // Snapshot book fields on the order item so past orders remain
            // readable after an administrator edits the book catalog.
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

    @Override
    @Transactional(readOnly = true)
    public List<BookSalesStatsResponse> getBookSalesStats(LocalDate startDate, LocalDate endDate) {
        return bookOrderRepository.summarizeBookSales(toStartAt(startDate), toEndAt(endDate)).stream()
                .map(row -> new BookSalesStatsResponse(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        ((Number) row[4]).intValue(),
                        (BigDecimal) row[5]
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserConsumptionStatsResponse> getUserConsumptionStats(LocalDate startDate, LocalDate endDate) {
        return bookOrderRepository.summarizeUserConsumption(toStartAt(startDate), toEndAt(endDate)).stream()
                .map(row -> new UserConsumptionStatsResponse(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        fullName((String) row[2], (String) row[3]),
                        ((Number) row[4]).intValue(),
                        (BigDecimal) row[5]
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerStatsResponse getCustomerStats(Long userId, LocalDate startDate, LocalDate endDate) {
        ensureUserExists(userId);
        List<BookPurchaseStatsResponse> books = bookOrderRepository
                .summarizeCustomerPurchases(userId, toStartAt(startDate), toEndAt(endDate))
                .stream()
                .map(row -> new BookPurchaseStatsResponse(
                        ((Number) row[0]).longValue(),
                        (String) row[1],
                        (String) row[2],
                        ((Number) row[3]).intValue(),
                        (BigDecimal) row[4]
                ))
                .toList();
        int totalQuantity = books.stream()
                .mapToInt(BookPurchaseStatsResponse::quantity)
                .sum();
        BigDecimal totalAmount = books.stream()
                .map(BookPurchaseStatsResponse::totalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CustomerStatsResponse(books, totalQuantity, totalAmount);
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
        User user = order.getUser();
        return new OrderResponse(
                order.getId(),
                user.getId(),
                user.getUsername(),
                fullName(user.getFirstName(), user.getLastName()),
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

    private LocalDateTime toStartAt(LocalDate date) {
        return date == null ? null : date.atStartOfDay();
    }

    private LocalDateTime toEndAt(LocalDate date) {
        return date == null ? null : date.plusDays(1).atStartOfDay();
    }

    private String normalizeSearch(String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }

        return source.trim();
    }

    private String fullName(String firstName, String lastName) {
        return String.join(" ", firstName, lastName).trim();
    }
}
