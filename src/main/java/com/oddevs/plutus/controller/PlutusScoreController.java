package com.oddevs.plutus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oddevs.plutus.model.PlutusScore;
import com.oddevs.plutus.repository.PlutusScoreRepository;

@RestController
public class PlutusScoreController {

	@Autowired
   PlutusScoreRepository plutusScoreRepository;
	
	@GetMapping("/plutusScore")
	public List<PlutusScore> getAllPlutusScores() {
	    return plutusScoreRepository.findAll();
	}
}