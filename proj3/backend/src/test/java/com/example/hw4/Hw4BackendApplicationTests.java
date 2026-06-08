package com.example.hw4;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class Hw4BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnAllBooks() throws Exception {
        mockMvc.perform(get("/api/v1/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].title", is("Refactoring")))
                .andExpect(jsonPath("$[0].stock", is(24)));
    }

    @Test
    void shouldReturnBookDetailById() throws Exception {
        mockMvc.perform(get("/api/v1/book/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Refactoring")))
                .andExpect(jsonPath("$.isbn", is("978-0201485677")))
                .andExpect(jsonPath("$.description", hasSize(2)));
    }

    @Test
    void shouldRegisterUser() throws Exception {
        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "jerry",
                                  "password": "123456",
                                  "confirmPassword": "123456",
                                  "email": "jerry@example.com",
                                  "firstName": "Tom",
                                  "lastName": "Cat",
                                  "twitter": "@TomCat",
                                  "avatarUrl": "https://example.com/avatar.jpg",
                                  "notes": "Homework 4 registration test"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message", is("User registered successfully")))
                .andExpect(jsonPath("$.fullName", is("Tom Cat")));
    }

    @Test
    void shouldLoginWithDatabaseUser() throws Exception {
        mockMvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "tom",
                                  "password": "123456"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("tom")))
                .andExpect(jsonPath("$.role", is("CUSTOMER")))
                .andExpect(jsonPath("$.fullName", is("Tom Cat")));
    }

    @Test
    void shouldRejectDisabledUserLogin() throws Exception {
        mockMvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "disabled",
                                  "password": "123456"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("您的账号已经被禁用")));
    }

    @Test
    void shouldAddUpdateAndRemoveCartItem() throws Exception {
        mockMvc.perform(post("/api/v1/users/1/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "bookId": 1,
                                  "quantity": 2
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].title", is("Refactoring")))
                .andExpect(jsonPath("$.items[0].quantity", is(2)))
                .andExpect(jsonPath("$.items[0].stock", is(24)))
                .andExpect(jsonPath("$.totalAmount", is(178.0)));

        mockMvc.perform(put("/api/v1/users/1/cart/items/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "quantity": 3
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].quantity", is(3)))
                .andExpect(jsonPath("$.totalAmount", is(267.0)));

        mockMvc.perform(delete("/api/v1/users/1/cart/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)))
                .andExpect(jsonPath("$.totalAmount", is(0)));
    }

    @Test
    void shouldCheckoutCartIntoOrderAndClearCart() throws Exception {
        mockMvc.perform(post("/api/v1/users/1/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "bookId": 2,
                                  "quantity": 1
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/users/1/orders"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PAID")))
                .andExpect(jsonPath("$.username", is("tom")))
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].title", is("The Mythical Man-Month")))
                .andExpect(jsonPath("$.totalAmount", is(45.0)));

        mockMvc.perform(get("/api/v1/users/1/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)));

        mockMvc.perform(get("/api/v1/users/1/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].items[0].title", is("The Mythical Man-Month")));

        mockMvc.perform(get("/api/v1/book/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock", is(15)));
    }

    @Test
    void shouldManageUsersAndBooksForAdminViews() throws Exception {
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[1].role", is("ADMIN")));

        mockMvc.perform(put("/api/v1/users/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "disabled": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.disabled", is(true)));

        mockMvc.perform(post("/api/v1/admin/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "slug": "domain-driven-design",
                                  "title": "Domain-Driven Design",
                                  "author": "Eric Evans",
                                  "publisher": "Addison-Wesley",
                                  "category": "Software Architecture",
                                  "language": "English",
                                  "isbn": "978-0321125217",
                                  "price": 96.00,
                                  "stock": 8,
                                  "status": "In Stock",
                                  "cover": "/images/book1.jpg",
                                  "summary": "A classic book about strategic design.",
                                  "description": "DDD connects software models with domain language.",
                                  "highlights": "Ubiquitous language\\nAggregates and repositories"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Domain-Driven Design")))
                .andExpect(jsonPath("$.stock", is(8)));
    }

    @Test
    void shouldFilterOrdersAndReturnStats() throws Exception {
        mockMvc.perform(post("/api/v1/users/1/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "bookId": 1,
                                  "quantity": 2
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/users/1/orders"))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/users/1/orders?bookName=Refactoring"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].items[0].title", is("Refactoring")));

        mockMvc.perform(get("/api/v1/admin/orders?bookName=Refactoring"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].username", is("tom")));

        mockMvc.perform(get("/api/v1/admin/stats/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is("Refactoring")))
                .andExpect(jsonPath("$[0].totalQuantity", is(2)));

        mockMvc.perform(get("/api/v1/admin/stats/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username", is("tom")))
                .andExpect(jsonPath("$[0].totalQuantity", is(2)));

        mockMvc.perform(get("/api/v1/users/1/orders/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity", is(2)))
                .andExpect(jsonPath("$.books[0].title", is("Refactoring")));
    }
}
