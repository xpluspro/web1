package com.example.hw4.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record BookUpsertRequest(
        @NotBlank(message = "Book slug is required")
        @Size(max = 100, message = "Book slug is too long")
        String slug,

        @NotBlank(message = "Book title is required")
        @Size(max = 255, message = "Book title is too long")
        String title,

        @NotBlank(message = "Book author is required")
        @Size(max = 255, message = "Book author is too long")
        String author,

        @NotBlank(message = "Publisher is required")
        @Size(max = 255, message = "Publisher is too long")
        String publisher,

        @NotBlank(message = "Category is required")
        @Size(max = 100, message = "Category is too long")
        String category,

        @NotBlank(message = "Language is required")
        @Size(max = 50, message = "Language is too long")
        String language,

        @NotBlank(message = "ISBN is required")
        @Size(max = 50, message = "ISBN is too long")
        String isbn,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal price,

        @Min(value = 0, message = "Stock cannot be negative")
        int stock,

        @Size(max = 50, message = "Status is too long")
        String status,

        @NotBlank(message = "Cover is required")
        @Size(max = 2000000, message = "Cover image is too large")
        String cover,

        @NotBlank(message = "Summary is required")
        @Size(max = 1000, message = "Summary is too long")
        String summary,

        @NotBlank(message = "Description is required")
        String description,

        @NotBlank(message = "Highlights are required")
        String highlights
) {
}
