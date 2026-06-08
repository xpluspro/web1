package com.example.hw4.repository;

import com.example.hw4.entity.BookOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookOrderRepository extends JpaRepository<BookOrder, Long> {

    List<BookOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
}
