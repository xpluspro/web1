package com.example.hw4.service;

import com.example.hw4.dto.BookDetailResponse;
import com.example.hw4.dto.BookSummaryResponse;
import java.util.List;

public interface BookService {

    List<BookSummaryResponse> getAllBooks();

    BookDetailResponse getBookById(Long id);
}
