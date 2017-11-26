package com.oddevs.plutus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oddevs.plutus.domain.StockHistory;

@Repository
public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {

}
