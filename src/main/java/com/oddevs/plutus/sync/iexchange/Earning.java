package com.oddevs.plutus.sync.iexchange;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Earning {

	private BigDecimal actualEPS;
	private String EPSReportDate;
	
	public BigDecimal getActualEPS() {
		return actualEPS;
	}

	public void setActualEPS(BigDecimal actualEPS) {
		this.actualEPS = actualEPS;
	}

	public String getEPSReportDate() {
		return EPSReportDate;
	}

	public void setEPSReportDate(String ePSReportDate) {
		EPSReportDate = ePSReportDate;
	}
	
}
