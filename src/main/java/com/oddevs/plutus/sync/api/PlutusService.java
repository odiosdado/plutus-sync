package com.oddevs.plutus.sync.api;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PlutusService {

	RestTemplate restTemplate = new RestTemplate();
	
	public List<Stock> getStocks(){
		ResponseEntity<List<Stock>> response = 
				restTemplate.exchange("http://localhost:8080/stocks",
				HttpMethod.GET, null,
				new ParameterizedTypeReference<List<Stock>>() {
				});
		return response.getBody();
	}
	
	public Stock saveStock(Stock stock){
		return restTemplate.postForObject("http://localhost:8080/stocks", 
				stock, Stock.class);
	}
	
	public StockHistory saveStockHistoryk(StockHistory history){
		return restTemplate.postForObject("http://localhost:8080/stockHistory", 
				history, StockHistory.class);
	}
}