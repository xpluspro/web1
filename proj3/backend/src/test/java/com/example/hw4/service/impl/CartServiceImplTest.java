package com.example.hw4.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.hw4.dto.AddCartItemRequest;
import com.example.hw4.dto.CartResponse;
import com.example.hw4.dto.UpdateCartItemRequest;
import com.example.hw4.entity.Book;
import com.example.hw4.entity.CartItem;
import com.example.hw4.entity.User;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.repository.BookRepository;
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
class CartServiceImplTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    @Test
    void shouldRejectAddItemWhenExistingQuantityWouldExceedStock() {
        User user = user(1L);
        Book book = book(2L, 5);
        CartItem item = cartItem(10L, user, book, 4);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById(2L)).thenReturn(Optional.of(book));
        when(cartItemRepository.findByUserIdAndBookId(1L, 2L)).thenReturn(Optional.of(item));

        assertThatThrownBy(() -> cartService.addItem(1L, new AddCartItemRequest(2L, 2)))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Insufficient stock for Clean Code");
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void shouldRejectUpdateItemWhenQuantityExceedsStock() {
        User user = user(1L);
        Book book = book(2L, 5);
        CartItem item = cartItem(10L, user, book, 3);
        when(cartItemRepository.findByUserIdAndBookId(1L, 2L)).thenReturn(Optional.of(item));

        assertThatThrownBy(() -> cartService.updateItem(1L, 2L, new UpdateCartItemRequest(6)))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Insufficient stock for Clean Code");
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void shouldUpdateItemWhenQuantityIsWithinStock() {
        User user = user(1L);
        Book book = book(2L, 5);
        CartItem item = cartItem(10L, user, book, 3);
        when(cartItemRepository.findByUserIdAndBookId(1L, 2L)).thenReturn(Optional.of(item));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUserIdOrderByUpdatedAtDesc(1L)).thenAnswer(invocation -> List.of(item));

        CartResponse response = cartService.updateItem(1L, 2L, new UpdateCartItemRequest(5));

        ArgumentCaptor<CartItem> itemCaptor = ArgumentCaptor.forClass(CartItem.class);
        verify(cartItemRepository).save(itemCaptor.capture());
        assertThat(itemCaptor.getValue().getQuantity()).isEqualTo(5);
        assertThat(response.items()).hasSize(1);
        assertThat(response.items().get(0).quantity()).isEqualTo(5);
        assertThat(response.totalAmount()).isEqualByComparingTo("360.00");
    }

    @Test
    void shouldAddNewItemWhenQuantityIsWithinStock() {
        User user = user(1L);
        Book book = book(2L, 5);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById(2L)).thenReturn(Optional.of(book));
        when(cartItemRepository.findByUserIdAndBookId(1L, 2L)).thenReturn(Optional.empty());
        when(cartItemRepository.findByUserIdOrderByUpdatedAtDesc(1L)).thenAnswer(invocation -> {
            CartItem savedItem = cartItem(10L, user, book, 2);
            return List.of(savedItem);
        });

        CartResponse response = cartService.addItem(1L, new AddCartItemRequest(2L, 2));

        ArgumentCaptor<CartItem> itemCaptor = ArgumentCaptor.forClass(CartItem.class);
        verify(cartItemRepository).save(itemCaptor.capture());
        assertThat(itemCaptor.getValue().getQuantity()).isEqualTo(2);
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
