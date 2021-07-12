import logger from './logger'
import plutusService from './services/plutus.service';
import fmpService from './services/fmp.service';
import { removeDuplicates, getMonthlyDatesBetweenRange, splitIntoEqualChunks } from './utils/helpers';
import config from './constants/config';
import insertRowsAsStream from './services/bigquery';

async function processEachChunk(dates, chunk) {
  for (const date of dates) {
    for (const stock of chunk) {
      try {
        const stockData = await fmpService.getStockData(date, stock.symbol);
        if (stockData) {
          const plutusValue = await plutusService.getValueFromFormula(stockData, config.plutusFormula)
          stock = { ... stock, ... stockData, plutusValue }
          insertRowsAsStream([stock])
        }
      } catch (error) {
        logger.error(error.message);
        logger.error(error.stack);
      }
    };
  }
}

async function loadStockData(dates) {
  const stocks = await fmpService.getStockList()
  logger.debug(`Loading new stock data`)
  logger.debug(`stocks: ${stocks.length}`)
  // processEachChunk(dates, stocks)
  
  const chunks = splitIntoEqualChunks(stocks);
  logger.debug(`chunks: ${chunks.length}`)
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];
    logger.debug(`processing chunk ${index} of ${chunks.length}`)
    processEachChunk(dates, chunk)
  }
}

async function loadAlgorithmValues(date) {
  logger.debug(`Loading new algorithm values`)
  try {
    await plutusService.aggregateAlgoritmValues('quarterly', date);
  } catch (error) {
    logger.error(error);
  }
}

async function init(dates) {
  try {
    loadStockData(dates);
    //processEachChunk(dates, [{ symbol: 'AAPL'}])
  } catch (error) {
    logger.error(error.message);
    logger.error(error.stack);
  }
}

logger.debug('Starting plutus-sync');
var args = process.argv.slice(2);
logger.debug({ args });
let startDate = args[0] ? args[0].split('=')[1] : null;
let endDate = args[1] ? args[1].split('=')[1] : null;
const dates = getMonthlyDatesBetweenRange(startDate, endDate);
console.log({ dates });
init(dates);