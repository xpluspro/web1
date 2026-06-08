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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class Hw4BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnAllBooks() throws Exception {
        mockMvc.perform(get("/api/v1/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].title", is("Refactoring")));
    }

    @Test
    void shouldReturnBookDetailById() throws Exception {
        mockMvc.perform(get("/api/v1/book/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Refactoring")))
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
                .andExpect(jsonPath("$.fullName", is("Tom Cat")));
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
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].title", is("The Mythical Man-Month")))
                .andExpect(jsonPath("$.totalAmount", is(45.0)));

        mockMvc.perform(get("/api/v1/users/1/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)));

        mockMvc.perform(get("/api/v1/users/1/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].items[0].title", is("The Mythical Man-Month")));
    }
}
