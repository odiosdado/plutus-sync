package com.oddevs.plutus.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oddevs.plutus.domain.StockHistory;
import com.oddevs.plutus.service.PlutusScoreService;

@RestController
public class PlutusScoreController {

	@Autowired
	PlutusScoreService plutusScoreService;
	
	@GetMapping("/plutusScore/top/{top}")
	public List<StockHistory> findTopPlutusScore(@PathVariable(value = "top") int top) {
	    return plutusScoreService.findTop(top);
	}
	
	@GetMapping("/plutusScore")
	public List<StockHistory> findPlutusScoreByRange(@RequestParam("begin") BigDecimal begin, @RequestParam("end") BigDecimal end) {
	   return plutusScoreService.findByRange(begin, end);
	}
}