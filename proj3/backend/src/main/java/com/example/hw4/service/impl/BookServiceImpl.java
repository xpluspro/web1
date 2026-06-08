package com.example.hw4.service.impl;

import com.example.hw4.dto.BookDetailResponse;
import com.example.hw4.dto.BookSummaryResponse;
import com.example.hw4.dto.BookUpsertRequest;
import com.example.hw4.entity.Book;
import com.example.hw4.exception.BadRequestException;
import com.example.hw4.exception.ResourceNotFoundException;
import com.example.hw4.repository.BookRepository;
import com.example.hw4.service.BookService;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookSummaryResponse> getAllBooks() {
        return bookRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookDetailResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));
        return toDetailResponse(book);
    }

    @Override
    @Transactional
    public BookDetailResponse createBook(BookUpsertRequest request) {
        ensureUniqueBookKeys(null, request.slug(), request.isbn());
        Book book = new Book();
        applyRequest(book, request);
        return toDetailResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public BookDetailResponse updateBook(Long id, BookUpsertRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));
        ensureUniqueBookKeys(id, request.slug(), request.isbn());
        applyRequest(book, request);
        return toDetailResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found: " + id);
        }

        bookRepository.deleteById(id);
    }

    private BookSummaryResponse toSummaryResponse(Book book) {
        return new BookSummaryResponse(
                book.getId(),
                book.getSlug(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getCategory(),
                book.getLanguage(),
                book.getIsbn(),
                book.getPrice(),
                book.getStock(),
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
                book.getStock(),
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

    private void ensureUniqueBookKeys(Long currentId, String slug, String isbn) {
        bookRepository.findBySlug(slug.trim())
                .filter(book -> !book.getId().equals(currentId))
                .ifPresent(book -> {
                    throw new BadRequestException("Book slug already exists");
                });
        bookRepository.findByIsbn(isbn.trim())
                .filter(book -> !book.getId().equals(currentId))
                .ifPresent(book -> {
                    throw new BadRequestException("ISBN already exists");
                });
    }

    private void applyRequest(Book book, BookUpsertRequest request) {
        book.setSlug(request.slug().trim());
        book.setTitle(request.title().trim());
        book.setAuthor(request.author().trim());
        book.setPublisher(request.publisher().trim());
        book.setCategory(request.category().trim());
        book.setLanguage(request.language().trim());
        book.setIsbn(request.isbn().trim());
        book.setPrice(request.price());
        book.setStock(request.stock());
        book.setStatus(statusOrDefault(request.status(), request.stock()));
        book.setCover(request.cover().trim());
        book.setSummary(request.summary().trim());
        book.setDescription(request.description().trim());
        book.setHighlights(request.highlights().trim());
    }

    private String statusOrDefault(String status, int stock) {
        if (status == null || status.trim().isEmpty()) {
            return stock > 0 ? "In Stock" : "Out of Stock";
        }

        return status.trim();
    }
}
