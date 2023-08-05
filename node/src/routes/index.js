import logger from '../logger'
import plutusService from '../services/plutus.service';
import fmpService from '../services/fmp.service';
import { getMonthlyDatesBetweenRange, splitIntoEqualChunks, estimatedRunTime } from '../utils/helpers';
import config from '../constants/config';
import insertRowsAsStream from '../services/bigquery';

async function processEachChunk(dates, chunk) {
  let completedStocks = []
  for (const stock of chunk) {
    const stockAllQuarterData = await fmpService.getFinancialDataForAllQuarters(stock.symbol);
    if(!stockAllQuarterData){
      continue;
    }
    for(const date of dates) {
      const stockQuarterData = await fmpService.getFinancialDataFromMostRecentQuarter(date, stockAllQuarterData, stock.symbol);
      if(!stockQuarterData){
        continue;
      }
      const price = await fmpService.getStockPriceByDate(date, stock.symbol);
      if(!price){
        continue
      }
      let stockData = {
        ...stock,
        ...stockQuarterData,
        price,
      }
      const plutusValue = await plutusService.getValueFromFormula(stockData, config.plutusFormula);
      stockData = {
        ...stockData,
        plutusValue,
        valueDate: date.toISOString().slice(0, -1),
      }
      completedStocks.push(stockData);
    }
  }
  insertRowsAsStream(completedStocks)
}

export async function runSync(start, end, test) {
  logger.debug(`loadStockData() start=${start}, end=${end}, test=${test}`)
  const dates = getMonthlyDatesBetweenRange(start, end);
  let stocks = [{ symbol: 'AAPL'}]
  if(!test) {
    stocks = await fmpService.getStockList()
    logger.debug(`Stocks found: ${stocks.length}`)
  }
  logger.debug(`estimated run time: ${estimatedRunTime(stocks.length)}`)
  const chunks = splitIntoEqualChunks(stocks);
  logger.debug(`equal chunks split: ${chunks.length}`)
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    logger.debug(`processing chunk ${index} of ${chunks.length}`)
    processEachChunk(dates, chunk)
  }
}
