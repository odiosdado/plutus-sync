package com.oddevs.plutus.sync.api;

import java.math.BigDecimal;

public class StockHistory {

	private Long id;
	private Stock stock;
	private BigDecimal dividendShare;
	private BigDecimal price;
	private BigDecimal bookValue;
	private BigDecimal dividend;
	private BigDecimal plutusScore;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Stock getStock() {
		return stock;
	}
	public void setStock(Stock stock) {
		this.stock = stock;
	}
	public BigDecimal getDividendShare() {
		return dividendShare;
	}
	public void setDividendShare(BigDecimal dividendShare) {
		this.dividendShare = dividendShare;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public BigDecimal getBookValue() {
		return bookValue;
	}
	public void setBookValue(BigDecimal bookValue) {
		this.bookValue = bookValue;
	}
	public BigDecimal getDividend() {
		return dividend;
	}
	public void setDividend(BigDecimal dividend) {
		this.dividend = dividend;
	}
	public BigDecimal getPlutusScore() {
		return plutusScore;
	}
	public void setPlutusScore(BigDecimal plutusScore) {
		this.plutusScore = plutusScore;
	}
}
