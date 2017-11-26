package com.oddevs.plutus.service;

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
	public List<StockHistory> findTopByRange(int range) {
		TypedQuery<StockHistory> query = em.createQuery("select a from Account a where a.customer = ?1", StockHistory.class);
		query.setParameter(1, range);
		return query.getResultList();
	}
}
