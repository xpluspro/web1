package com.example.hw4.repository;

import com.example.hw4.entity.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<CartItem> findByUserIdAndBookId(Long userId, Long bookId);

    void deleteByUserIdAndBookId(Long userId, Long bookId);

    void deleteByUserId(Long userId);
}
