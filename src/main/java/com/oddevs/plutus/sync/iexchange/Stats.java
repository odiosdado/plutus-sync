package com.oddevs.plutus.sync.iexchange;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown = true)
public class Stats {

	private BigDecimal priceToBook;

	public BigDecimal getPriceToBook() {
		return priceToBook;
	}

	public void setPriceToBook(BigDecimal priceToBook) {
		this.priceToBook = priceToBook;
	}
	
}
