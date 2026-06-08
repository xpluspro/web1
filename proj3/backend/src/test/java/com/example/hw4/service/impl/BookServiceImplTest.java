package com.example.hw4.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.hw4.dto.BookDetailResponse;
import com.example.hw4.dto.BookUpsertRequest;
import com.example.hw4.entity.Book;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.exception.ResourceNotFoundException;
import com.example.hw4.repository.BookRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class BookServiceImplTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    @Test
    void shouldCreateBookWhenSlugAndIsbnAreUnique() {
        BookUpsertRequest request = request(" clean-code ", "978-0132350884", "", 8);
        when(bookRepository.findBySlug("clean-code")).thenReturn(Optional.empty());
        when(bookRepository.findByIsbn("978-0132350884")).thenReturn(Optional.empty());
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> {
            Book savedBook = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedBook, "id", 42L);
            return savedBook;
        });

        BookDetailResponse response = bookService.createBook(request);

        ArgumentCaptor<Book> bookCaptor = ArgumentCaptor.forClass(Book.class);
        verify(bookRepository).save(bookCaptor.capture());
        Book savedBook = bookCaptor.getValue();
        assertThat(savedBook.getSlug()).isEqualTo("clean-code");
        assertThat(savedBook.getStatus()).isEqualTo("In Stock");
        assertThat(response.id()).isEqualTo(42L);
        assertThat(response.description()).containsExactly("First line", "Second line");
    }

    @Test
    void shouldRejectCreateBookWhenSlugAlreadyExists() {
        Book existingBook = book(7L, "clean-code", "978-0132350884", 5);
        when(bookRepository.findBySlug("clean-code")).thenReturn(Optional.of(existingBook));

        assertThatThrownBy(() -> bookService.createBook(request("clean-code", "978-1111111111", "In Stock", 5)))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Book slug already exists");
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    void shouldRejectCreateBookWhenIsbnAlreadyExists() {
        Book existingBook = book(7L, "another-book", "978-0132350884", 5);
        when(bookRepository.findBySlug("clean-code")).thenReturn(Optional.empty());
        when(bookRepository.findByIsbn("978-0132350884")).thenReturn(Optional.of(existingBook));

        assertThatThrownBy(() -> bookService.createBook(request("clean-code", "978-0132350884", "In Stock", 5)))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("ISBN already exists");
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    void shouldThrowWhenBookDetailDoesNotExist() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.getBookById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Book not found: 99");
    }

    @Test
    void shouldDeleteBookWhenItExists() {
        when(bookRepository.existsById(42L)).thenReturn(true);

        bookService.deleteBook(42L);

        verify(bookRepository).deleteById(42L);
    }

    @Test
    void shouldThrowWhenDeletingMissingBook() {
        when(bookRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> bookService.deleteBook(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Book not found: 99");
        verify(bookRepository, never()).deleteById(99L);
    }

    private BookUpsertRequest request(String slug, String isbn, String status, int stock) {
        return new BookUpsertRequest(
                slug,
                "Clean Code",
                "Robert C. Martin",
                "Prentice Hall",
                "Coding Practice",
                "English",
                isbn,
                BigDecimal.valueOf(72.00),
                stock,
                status,
                "/images/book4.jpg",
                "A practical book about readable code.",
                "First line\\nSecond line",
                "Readable code\\nTesting habits"
        );
    }

    private Book book(Long id, String slug, String isbn, int stock) {
        Book book = new Book();
        ReflectionTestUtils.setField(book, "id", id);
        book.setSlug(slug);
        book.setTitle("Clean Code");
        book.setAuthor("Robert C. Martin");
        book.setPublisher("Prentice Hall");
        book.setCategory("Coding Practice");
        book.setLanguage("English");
        book.setIsbn(isbn);
        book.setPrice(BigDecimal.valueOf(72.00));
        book.setStock(stock);
        book.setStatus(stock > 0 ? "In Stock" : "Out of Stock");
        book.setCover("/images/book4.jpg");
        book.setSummary("A practical book about readable code.");
        book.setDescription("First line\\nSecond line");
        book.setHighlights("Readable code\\nTesting habits");
        return book;
    }
}
