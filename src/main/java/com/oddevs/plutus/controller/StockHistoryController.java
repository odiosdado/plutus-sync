package com.oddevs.plutus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oddevs.plutus.domain.StockHistory;
import com.oddevs.plutus.repository.StockHistoryRepository;

@RestController
public class StockHistoryController {

	@Autowired
	StockHistoryRepository stockHistoryRepository;
	
	@GetMapping("/stockHistory")
	public List<StockHistory> getAllStockHistories() {
	    return stockHistoryRepository.findAll();
	}
}