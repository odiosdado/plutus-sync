package com.oddevs.plutus.sync.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PlutusService {

	RestTemplate restTemplate = new RestTemplate();
	
	@Value("${plutus.api.url}")
	private String plutusApiUrl;
	
	public List<Stock> getStocks(){
		ResponseEntity<List<Stock>> response = 
				restTemplate.exchange(plutusApiUrl+"/stocks",
				HttpMethod.GET, null,
				new ParameterizedTypeReference<List<Stock>>() {
				});
		return response.getBody();
	}
	
	public Stock saveStock(Stock stock){
		return restTemplate.postForObject(plutusApiUrl+"/stocks", 
				stock, Stock.class);
	}
	
	public StockHistory saveStockHistoryk(StockHistory history){
		return restTemplate.postForObject(plutusApiUrl+"/stockHistory", 
				history, StockHistory.class);
	}
}