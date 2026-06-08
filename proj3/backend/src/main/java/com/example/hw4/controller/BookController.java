package com.example.hw4.controller;

import com.example.hw4.dto.BookDetailResponse;
import com.example.hw4.dto.BookSummaryResponse;
import com.example.hw4.dto.BookUpsertRequest;
import com.example.hw4.service.BookService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/books")
    public List<BookSummaryResponse> getBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/book/{id}")
    public BookDetailResponse getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping("/admin/books")
    @ResponseStatus(HttpStatus.CREATED)
    public BookDetailResponse createBook(@Valid @RequestBody BookUpsertRequest request) {
        return bookService.createBook(request);
    }

    @PutMapping("/admin/books/{id}")
    public BookDetailResponse updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookUpsertRequest request
    ) {
        return bookService.updateBook(id, request);
    }

    @DeleteMapping("/admin/books/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }
}
