package com.oddevs.plutus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oddevs.plutus.model.User;
import com.oddevs.plutus.repository.UserRepository;

@RestController
public class UserController {

	@Autowired
    UserRepository userRepository;
	
	@GetMapping("/users")
	public List<User> getAllUsers() {
	    return userRepository.findAll();
	}
}
