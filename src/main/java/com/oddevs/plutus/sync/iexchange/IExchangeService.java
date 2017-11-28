package com.oddevs.plutus.sync.iexchange;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IExchangeService {
    
	private RestTemplate restTemplate = new RestTemplate();
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private static final Logger log = LoggerFactory.getLogger(IExchangeService.class);
    
	public List<Symbol> getSymbols(){
		ResponseEntity<List<Symbol>> response = 
				restTemplate.exchange("https://api.iextrading.com/1.0/ref-data/symbols",
				HttpMethod.GET, null,
				new ParameterizedTypeReference<List<Symbol>>() {
				});
		return response.getBody();
	}
	
	public Earning getLatestEarnings(String symbol) throws Exception {
		String location = String.format("https://api.iextrading.com/1.0/stock/%s/earnings", symbol);
		Earnings earnings = restTemplate.getForObject(location, Earnings.class);
		return earnings.getEarnings().get(0);
	}
	
	public List<Dividends> getDividends(String symbol){
		String location = String.format("https://api.iextrading.com/1.0/stock/%s/dividends/6m", symbol);
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