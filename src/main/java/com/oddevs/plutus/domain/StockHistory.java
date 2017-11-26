package com.oddevs.plutus.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "stock_history")
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties(value = {"created"}, 
        allowGetters = true)
public class StockHistory implements Serializable  {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
	
    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;
	
	@Column(name="dividend_share")
	private BigDecimal dividendShare;
	
	private BigDecimal price;
	
	@Column(name="book_value")
	private BigDecimal bookValue;
	
	private BigDecimal dividend;
	
	@Column(name="plutus_score")
	private BigDecimal plutusScore;
	
	@Column(nullable = false, updatable = false, name = "created")
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date created;
	
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

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public BigDecimal getPlutusScore() {
		return plutusScore;
	}

	public void setPlutusScore(BigDecimal plutusScore) {
		this.plutusScore = plutusScore;
	}
}