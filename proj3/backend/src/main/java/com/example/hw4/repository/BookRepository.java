package com.example.hw4.repository;

import com.example.hw4.entity.Book;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findBySlug(String slug);

    Optional<Book> findByIsbn(String isbn);
}
