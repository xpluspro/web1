package com.example.hw4.service;

import com.example.hw4.dto.BookDetailResponse;
import com.example.hw4.dto.BookSummaryResponse;
import com.example.hw4.dto.BookUpsertRequest;
import java.util.List;

public interface BookService {

    /**
     * Returns the catalog summary list used by both customer browsing and administrator management pages.
     */
    List<BookSummaryResponse> getAllBooks();

    /**
     * Loads one book with full detail content for the asynchronous detail view.
     */
    BookDetailResponse getBookById(Long id);

    /**
     * Creates a catalog book after checking unique slug and ISBN values.
     */
    BookDetailResponse createBook(BookUpsertRequest request);

    /**
     * Updates an existing catalog book while preserving slug and ISBN uniqueness.
     */
    BookDetailResponse updateBook(Long id, BookUpsertRequest request);

    /**
     * Removes a book from the catalog when the administrator deletes it.
     */
    void deleteBook(Long id);
}
