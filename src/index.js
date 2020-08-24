import logger from './logger'
import plutusService from './services/plutus.service';
import fmpService from './services/fmp.service';
import { removeDuplicates, getMonthlyDatesBetweenRange, splitIntoEqualChunks } from './utils/helpers';

async function loadStocks() {
  const plutusStocks = await plutusService.getStocks();
  const fmpStocks = await fmpService.getStockList();
  const stocksToCreate = removeDuplicates(fmpStocks, plutusStocks, 'symbol');

  logger.debug(`Loading new stocks into plutus`)
  logger.debug(`Plutus stocks: ${plutusStocks.length}`)
  logger.debug(`FMP stocks: ${fmpStocks.length}`)
  logger.debug(`After removing duplicates: ${stocksToCreate.length}`)

  for(const stock of stocksToCreate) {
    try {
      await plutusService.createStock(stock);
    } catch (error) {
      logger.error(error);
    }
  };
}

async function processEachChunk(dates, chunk) {
  for (const date of dates) {
    for (const stock of chunk) {
      try {
        const stockData = await fmpService.getStockData(date, stock.symbol);
        if (stockData) {
          const data = await plutusService.createStockData(stock.id, stockData);
          plutusService.aggregateAlgoritmValues(data, 'quarterly', date);
        }
      } catch (error) {
        logger.error(error.message);
      }
    };
  }
}

async function loadStockData(dates) {
  const plutusStocks = await plutusService.getStocks();
  logger.debug(`Loading new stock data`)
  logger.debug(`Plutus stocks: ${plutusStocks.length}`)
  const chunks = splitIntoEqualChunks(plutusStocks);
  for (const chunk of chunks) {
    logger.debug(`processing chunk ${chunks[chunk]}`);
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
    await loadStocks();
    loadStockData(dates);
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