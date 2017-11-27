package com.oddevs.plutus.sync.iexchange;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IExchangeService {
    
	RestTemplate restTemplate = new RestTemplate();
    
	public List<Symbol> getSymbols(){
		ResponseEntity<List<Symbol>> response = 
				restTemplate.exchange("https://api.iextrading.com/1.0/ref-data/symbols",
				HttpMethod.GET, null,
				new ParameterizedTypeReference<List<Symbol>>() {
				});
		return response.getBody();
	}
	
	public Earnings getEarnings(String symbol){
		String location = String.format("https://api.iextrading.com/1.0/stock/%s/earnings", symbol);
		return restTemplate.getForObject(location, Earnings.class);
	}
	
	public List<Dividends> getDividends(String symbol){
		String location = String.format("https://api.iextrading.com/1.0/stock/%s/dividends/1m", symbol);
		ResponseEntity<List<Dividends>> response = 
				restTemplate.exchange(location,
				HttpMethod.GET, null,
				new ParameterizedTypeReference<List<Dividends>>() {
				});
		return response.getBody();
	}
	
	public BigDecimal getPrice(String symbol){
		String location = String.format("https://api.iextrading.com/1.0/stock/%s/price", symbol);
		return restTemplate.getForObject(location, BigDecimal.class);
	}
	
	public Stats getStats(String symbol){
		String location = String.format("https://api.iextrading.com/1.0/stock/%s/stats", symbol);
		return restTemplate.getForObject(location, Stats.class);
	}
}