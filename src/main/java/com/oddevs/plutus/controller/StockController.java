package com.oddevs.plutus.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.oddevs.plutus.domain.Stock;
import com.oddevs.plutus.domain.StockHistory;
import com.oddevs.plutus.repository.StockRepository;
import com.oddevs.plutus.service.PlutusScoreService;

@RestController
public class StockController {

	@Autowired
	StockRepository stockRepository;
	
	@Autowired
	PlutusScoreService plutusScoreService;
	
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
	
	@GetMapping("/stocks/{id}/plutusScore")
	public ResponseEntity<StockHistory> getStockPlutusScore(@PathVariable(value = "id") Long stockId) {
		StockHistory plutusScore = plutusScoreService.findLatestByStockId(stockId);
	    if(plutusScore == null) {
	        return ResponseEntity.notFound().build();
	    }
	    return ResponseEntity.ok().body(plutusScore);
	}
	
	@PostMapping("/stocks")
	public Stock createStock(@Valid @RequestBody Stock stock) {
		return stockRepository.save(stock);
	}
}