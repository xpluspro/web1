package com.example.hw4.service.impl;

import com.example.hw4.dto.BookDetailResponse;
import com.example.hw4.dto.BookSummaryResponse;
import com.example.hw4.entity.Book;
import com.example.hw4.exception.ResourceNotFoundException;
import com.example.hw4.repository.BookRepository;
import com.example.hw4.service.BookService;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public List<BookSummaryResponse> getAllBooks() {
        return bookRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookDetailResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));
        return toDetailResponse(book);
    }

    private BookSummaryResponse toSummaryResponse(Book book) {
        return new BookSummaryResponse(
                book.getId(),
                book.getSlug(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getCategory(),
                book.getPrice(),
                book.getStatus(),
                book.getCover(),
                book.getSummary()
        );
    }

    private BookDetailResponse toDetailResponse(Book book) {
        return new BookDetailResponse(
                book.getId(),
                book.getSlug(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getCategory(),
                book.getLanguage(),
                book.getIsbn(),
                book.getPrice(),
                book.getStatus(),
                book.getCover(),
                book.getSummary(),
                splitLines(book.getDescription()),
                splitLines(book.getHighlights())
        );
    }

    private List<String> splitLines(String source) {
        String normalized = source.replace("\\n", "\n");
        return Arrays.stream(normalized.split("\\R+"))
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .toList();
    }
}
