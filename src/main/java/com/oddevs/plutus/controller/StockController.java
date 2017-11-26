package com.oddevs.plutus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.oddevs.plutus.model.Stock;
import com.oddevs.plutus.repository.StockRepository;

@RestController
public class StockController {

	@Autowired
	StockRepository stockRepository;
	
	@GetMapping("/stocks")
	public List<Stock> getAllStocks() {
	    return stockRepository.findAll();
	}
	
	@GetMapping("/stocks/{id}")
	public ResponseEntity<Stock> getStockById(@PathVariable(value = "id") Long stockId) {
		Stock stock = stockRepository.findOne(stockId);
	    if(stock == null) {
	        return ResponseEntity.notFound().build();
	    }
	    return ResponseEntity.ok().body(stock);
	}
}