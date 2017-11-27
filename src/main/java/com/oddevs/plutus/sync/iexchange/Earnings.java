package com.oddevs.plutus.sync.iexchange;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Earnings {

	private List<Earning> earnings;

	public List<Earning> getEarnings() {
		return earnings;
	}

	public void setEarnings(List<Earning> earnings) {
		this.earnings = earnings;
	}
	
}
