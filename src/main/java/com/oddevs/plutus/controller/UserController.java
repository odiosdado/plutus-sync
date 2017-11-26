package com.oddevs.plutus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.oddevs.plutus.domain.User;
import com.oddevs.plutus.repository.UserRepository;

@RestController
public class UserController {

	@Autowired
    UserRepository userRepository;
	
	@GetMapping("/users")
	public List<User> getAllUsers() {
	    return userRepository.findAll();
	}
	
	@GetMapping("/users/{id}")
	public ResponseEntity<User> getUserById(@PathVariable(value = "id") Long userId) {
		User user = userRepository.findOne(userId);
	    if(user == null) {
	        return ResponseEntity.notFound().build();
	    }
	    return ResponseEntity.ok().body(user);
	}
}