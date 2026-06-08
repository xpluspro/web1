package com.example.hw4.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.hw4.dto.OrderResponse;
import com.example.hw4.entity.Book;
import com.example.hw4.entity.BookOrder;
import com.example.hw4.entity.CartItem;
import com.example.hw4.entity.User;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.repository.BookOrderRepository;
import com.example.hw4.repository.CartItemRepository;
import com.example.hw4.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private BookOrderRepository bookOrderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void shouldRejectCheckoutWhenCartIsEmpty() {
        User user = user(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of());

        assertThatThrownBy(() -> orderService.checkout(1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Shopping cart is empty");
        verify(bookOrderRepository, never()).save(any(BookOrder.class));
        verify(cartItemRepository, never()).deleteByUserId(1L);
    }

    @Test
    void shouldRejectCheckoutWhenCartQuantityExceedsCurrentStock() {
        User user = user(1L);
        Book book = book(2L, 1);
        CartItem item = cartItem(10L, user, book, 2);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of(item));

        assertThatThrownBy(() -> orderService.checkout(1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Insufficient stock for Clean Code");
        verify(bookOrderRepository, never()).save(any(BookOrder.class));
        verify(cartItemRepository, never()).deleteByUserId(1L);
    }

    @Test
    void shouldCreateOrderDeductStockAndClearCartOnCheckout() {
        User user = user(1L);
        Book book = book(2L, 5);
        CartItem item = cartItem(10L, user, book, 2);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserIdOrderByUpdatedAtDesc(1L)).thenReturn(List.of(item));
        when(bookOrderRepository.save(any(BookOrder.class))).thenAnswer(invocation -> {
            BookOrder savedOrder = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedOrder, "id", 99L);
            return savedOrder;
        });

        OrderResponse response = orderService.checkout(1L);

        ArgumentCaptor<BookOrder> orderCaptor = ArgumentCaptor.forClass(BookOrder.class);
        verify(bookOrderRepository).save(orderCaptor.capture());
        verify(cartItemRepository).deleteByUserId(1L);

        BookOrder savedOrder = orderCaptor.getValue();
        assertThat(savedOrder.getStatus()).isEqualTo("PAID");
        assertThat(savedOrder.getTotalAmount()).isEqualByComparingTo("144.00");
        assertThat(savedOrder.getItems()).hasSize(1);
        assertThat(savedOrder.getItems().get(0).getTitle()).isEqualTo("Clean Code");
        assertThat(book.getStock()).isEqualTo(3);
        assertThat(response.id()).isEqualTo(99L);
        assertThat(response.items()).hasSize(1);
        assertThat(response.totalAmount()).isEqualByComparingTo("144.00");
    }

    private User user(Long id) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setUsername("tom");
        user.setPassword("123456");
        user.setEmail("tom@example.com");
        user.setFirstName("Tom");
        user.setLastName("Reader");
        user.setTwitter("@tom");
        user.setRole("CUSTOMER");
        user.setDisabled(false);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private Book book(Long id, int stock) {
        Book book = new Book();
        ReflectionTestUtils.setField(book, "id", id);
        book.setSlug("clean-code");
        book.setTitle("Clean Code");
        book.setAuthor("Robert C. Martin");
        book.setPublisher("Prentice Hall");
        book.setCategory("Coding Practice");
        book.setLanguage("English");
        book.setIsbn("978-0132350884");
        book.setPrice(BigDecimal.valueOf(72.00));
        book.setStock(stock);
        book.setStatus(stock > 0 ? "In Stock" : "Out of Stock");
        book.setCover("/images/book4.jpg");
        book.setSummary("A practical book about readable code.");
        book.setDescription("First line\\nSecond line");
        book.setHighlights("Readable code\\nTesting habits");
        return book;
    }

    private CartItem cartItem(Long id, User user, Book book, int quantity) {
        CartItem item = new CartItem();
        ReflectionTestUtils.setField(item, "id", id);
        item.setUser(user);
        item.setBook(book);
        item.setQuantity(quantity);
        item.setUpdatedAt(LocalDateTime.now());
        return item;
    }
}
