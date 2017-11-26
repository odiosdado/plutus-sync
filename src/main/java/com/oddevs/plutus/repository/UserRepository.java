package com.oddevs.plutus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oddevs.plutus.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
