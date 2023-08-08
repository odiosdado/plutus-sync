import moment from 'moment';
import logger from '../logger'
import plutusService from '../services/plutus.service';
import fmpService from '../services/fmp.service';
import { getMonthlyDatesBetweenRange, splitIntoEqualChunks, estimatedRunTime } from '../utils/helpers';
import config from '../constants/config';
import insertRowsAsStream from '../services/bigquery';

let metrics = {}

async function processEachChunk(dates, chunk, finalChunk) {
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
      updateMetrics(completedStocks.length, finalChunk)
    }
  }
  insertRowsAsStream(completedStocks)
}

export async function runSync(start, end, test) {
  logger.debug(`loadStockData() start=${start}, end=${end}, test=${test}`)
  const dates = getMonthlyDatesBetweenRange(start, end);
  let stocks = [{ symbol: 'AAPL'}]
  if(!test) {
    stocks = await fmpService.getFilteredStockList();
    logger.debug(`Stocks found: ${stocks.length}`)
  }
  let estRunTime = estimatedRunTime(stocks.length)
  logger.debug(`estimated run time: ${estRunTime}`)
  const chunks = splitIntoEqualChunks(stocks);
  logger.debug(`equal chunks split: ${chunks.length}`)
  metrics = {
    numOfStocks: stocks.length,
    estimatedRunTime: estRunTime,
    threads: chunks.length,
    stocksCompleted: 0,
    percentComplete: 0,
    startTime: moment(new Date()),
    actualRunTime: null,
    complete: false
  }
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    logger.debug(`processing chunk ${index} of ${chunks.length}`)
    processEachChunk(dates, chunk, index == chunks.length)
  }
}

const updateMetrics = (stocksCompleted, finalChunk) => {
  metrics.stocksCompleted = metrics.stocksCompleted + stocksCompleted
  metrics.percentComplete = Number((metrics.stocksCompleted / metrics.numOfStocks)).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 3 });
  const diff = moment.duration(moment(new Date()).diff(metrics.startTime));
  metrics.actualRunTime = moment.utc(diff.asMilliseconds()).format('HH:mm:ss');
  metrics.complete = finalChunk
  logger.debug({ metrics })
}
