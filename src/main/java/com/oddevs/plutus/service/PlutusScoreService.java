package com.oddevs.plutus.service;

import java.math.BigDecimal;
import java.util.List;

import com.oddevs.plutus.domain.StockHistory;

public interface PlutusScoreService {

	List<StockHistory> findTop(int top);
	List<StockHistory> findByRange(BigDecimal begin, BigDecimal end);
	StockHistory findLatestByStockId(Long stockId);
	
}
