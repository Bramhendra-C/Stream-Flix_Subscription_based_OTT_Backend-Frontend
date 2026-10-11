package com.StreamFlixBackend.StreamFlix.service;

import com.StreamFlixBackend.StreamFlix.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User registerUser(User user);

    Optional<User> login(String email, String password);

    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}