package com.oddevs.plutus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oddevs.plutus.model.Stock;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

}
