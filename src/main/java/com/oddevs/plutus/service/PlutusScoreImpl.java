package com.oddevs.plutus.service;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.oddevs.plutus.domain.StockHistory;

@Repository
public class PlutusScoreImpl implements PlutusScoreService {
	
	@PersistenceContext
	private EntityManager em;

	@Override
	public List<StockHistory> findTop(int range) {
		TypedQuery<StockHistory> query = 
				em.createQuery("select a from StockHistory a "
						+ "where a.id in (select max(b.id) "
						+ "from StockHistory b "
						+ "group by b.stock) "
						+ "order by a.plutusScore desc)", StockHistory.class);
		
		query.setMaxResults(range);
		return query.getResultList();
	}
	
	@Override
	public List<StockHistory> findByRange(BigDecimal begin, BigDecimal end) {
		TypedQuery<StockHistory> query = 
				em.createQuery("select a from StockHistory a "
						+ "where a.id in (select max(b.id) "
						+ "from StockHistory b "
						+ "group by b.stock) "
						+ "and a.plutusScore >= ?1 and a.plutusScore <= ?2 )", StockHistory.class);
		query.setParameter(1, begin);
		query.setParameter(2, end);
		return query.getResultList();
	}
}
