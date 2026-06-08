package com.example.hw4.repository;

import com.example.hw4.entity.BookOrder;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookOrderRepository extends JpaRepository<BookOrder, Long> {

    @EntityGraph(attributePaths = {"user", "items", "items.book"})
    List<BookOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    // The optional filters support both customer and admin order screens with one query.
    @EntityGraph(attributePaths = {"user", "items", "items.book"})
    @Query("""
            select distinct o from BookOrder o
            join o.items item
            where (:userId is null or o.user.id = :userId)
              and (:startAt is null or o.createdAt >= :startAt)
              and (:endAt is null or o.createdAt < :endAt)
              and (:bookName is null or lower(item.title) like lower(concat('%', :bookName, '%')))
            order by o.createdAt desc
            """)
    List<BookOrder> searchOrders(
            @Param("userId") Long userId,
            @Param("startAt") LocalDateTime startAt,
            @Param("endAt") LocalDateTime endAt,
            @Param("bookName") String bookName
    );

    // Aggregation queries keep statistics in the database instead of loading all
    // orders into Java memory and grouping them in application code.
    @Query("""
            select item.book.id, item.title, item.author, item.book.isbn,
                   sum(item.quantity), sum(item.subtotal)
            from BookOrder o
            join o.items item
            where (:startAt is null or o.createdAt >= :startAt)
              and (:endAt is null or o.createdAt < :endAt)
            group by item.book.id, item.title, item.author, item.book.isbn
            order by sum(item.quantity) desc, sum(item.subtotal) desc
            """)
    List<Object[]> summarizeBookSales(
            @Param("startAt") LocalDateTime startAt,
            @Param("endAt") LocalDateTime endAt
    );

    // Consumption ranking is sorted by total amount first, matching the course
    // requirement for an administrator-facing spending leaderboard.
    @Query("""
            select o.user.id, o.user.username, o.user.firstName, o.user.lastName,
                   sum(item.quantity), sum(item.subtotal)
            from BookOrder o
            join o.items item
            where (:startAt is null or o.createdAt >= :startAt)
              and (:endAt is null or o.createdAt < :endAt)
            group by o.user.id, o.user.username, o.user.firstName, o.user.lastName
            order by sum(item.subtotal) desc, sum(item.quantity) desc
            """)
    List<Object[]> summarizeUserConsumption(
            @Param("startAt") LocalDateTime startAt,
            @Param("endAt") LocalDateTime endAt
    );

    // Customer statistics reuse order items, so historical reports keep the
    // original purchase price even if the current book price later changes.
    @Query("""
            select item.book.id, item.title, item.author,
                   sum(item.quantity), sum(item.subtotal)
            from BookOrder o
            join o.items item
            where o.user.id = :userId
              and (:startAt is null or o.createdAt >= :startAt)
              and (:endAt is null or o.createdAt < :endAt)
            group by item.book.id, item.title, item.author
            order by sum(item.quantity) desc, sum(item.subtotal) desc
            """)
    List<Object[]> summarizeCustomerPurchases(
            @Param("userId") Long userId,
            @Param("startAt") LocalDateTime startAt,
            @Param("endAt") LocalDateTime endAt
    );
}
