package com.oddevs.plutus.service;

import java.util.List;

import com.oddevs.plutus.domain.StockHistory;

public interface PlutusScoreService {

	List<StockHistory> findTopByRange(int range);
	
}
