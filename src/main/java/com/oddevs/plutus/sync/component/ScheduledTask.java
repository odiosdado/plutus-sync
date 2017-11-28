package com.oddevs.plutus.sync.component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.oddevs.plutus.sync.api.PlutusService;
import com.oddevs.plutus.sync.api.Stock;
import com.oddevs.plutus.sync.api.StockHistory;
import com.oddevs.plutus.sync.iexchange.Dividends;
import com.oddevs.plutus.sync.iexchange.Earning;
import com.oddevs.plutus.sync.iexchange.IExchangeService;
import com.oddevs.plutus.sync.iexchange.Stats;
import com.oddevs.plutus.sync.iexchange.Symbol;

@Component
public class ScheduledTask {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTask.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    
    @Autowired
    IExchangeService iexchangeService;
    
    @Autowired
    PlutusService plutusService;
    
    @Scheduled(fixedDelay = 30000)
    public void runSync() {
        log.info("The time is now {}", dateFormat.format(new Date()));
        
        List<Symbol> symbols = iexchangeService.getSymbols();
        List<Stock> stocks = plutusService.getStocks();
        
        Set<String> cachedSymbols = stocks.stream().map(Stock::getSymbol).collect(Collectors.toSet());
        
        for(Symbol s : symbols){
        	
        	if(!cachedSymbols.contains(s.getSymbol())){
        		Stock stock = new Stock();
        		stock.setCompany(s.getName().isEmpty()?"N/A":s.getName());
        		stock.setSymbol(s.getSymbol());
        		plutusService.saveStock(stock);
        	}
        }
        
        stocks = plutusService.getStocks();
        for(Stock stock : stocks){
        	
        	try {
        		
        		Earning earning = iexchangeService.getLatestEarnings(stock.getSymbol());
            	List<Dividends> dividends = iexchangeService.getDividends(stock.getSymbol());
            	BigDecimal price = iexchangeService.getPrice(stock.getSymbol());
            	Stats stats = iexchangeService.getStats(stock.getSymbol());
            	
            	Dividends dividend = dividends.get(0);
            	
            	StockHistory history = new StockHistory();
            	history.setStock(stock);
            	history.setPrice(price);
            	history.setDividend(dividend.getAmount());
            	history.setEarnings(earning.getActualEPS());
            	history.setBookValue(stats.getPriceToBook());
            	
            	log.info("company: "+stock.getCompany()+" symbol: "+stock.getSymbol());
            	log.info("getActualEPS: "+earning.getActualEPS());
            	log.info("dividend: "+dividend.getAmount());
            	log.info("getPriceToBook: "+stats.getPriceToBook());
            	
            	BigDecimal plutusScore = (earning.getActualEPS()
            			.add(dividend.getAmount())
            			.divide(stats.getPriceToBook(), RoundingMode.HALF_EVEN));
            	history.setPlutusScore(plutusScore);
            	
            	plutusService.saveStockHistoryk(history);
            	
        	} catch (Exception e){
        		log.error("Error in sync with stock "+stock.getSymbol(),e);
        	}
        	
        }
    }
}