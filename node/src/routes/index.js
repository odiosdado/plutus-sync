import logger from '../logger'
import plutusService from '../services/plutus.service';
import fmpService from '../services/fmp.service';
import { getMonthlyDatesBetweenRange, splitIntoEqualChunks } from '../utils/helpers';
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
  console.log(`loadStockData() start=${start}, end=${end}`)
  const dates = getMonthlyDatesBetweenRange(start, end);
  let stocks = [{ symbol: 'AAPL'}]
  if(!test) {
    stocks = await fmpService.getStockList()
    console.log(`Stocks found: ${stocks.length}`)
  }
  const chunks = splitIntoEqualChunks(stocks);
  console.log(`equal chunks split: ${chunks.length}`)
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    console.log(`processing chunk ${index} of ${chunks.length}`)
    processEachChunk(dates, chunk)
  }
}

// async function init(dates) {
//   try {
//     loadStockData(dates);
//     //processEachChunk(dates, [{ symbol: 'AAPL'}])
//   } catch (error) {
//     logger.error(error.message);
//     logger.error(error.stack);
//   }
// }

// logger.debug('Starting plutus-sync');
// var args = process.argv.slice(2);
// logger.debug({ args });
// let startDate = args[0] ? args[0].split('=')[1] : null;
// let endDate = args[1] ? args[1].split('=')[1] : null;
// const dates = getMonthlyDatesBetweenRange(startDate, endDate);
// console.log({ dates });
// init(dates);