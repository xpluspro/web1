package com.example.hw4.controller;

import com.example.hw4.dto.BookDetailResponse;
import com.example.hw4.dto.BookSummaryResponse;
import com.example.hw4.service.BookService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
