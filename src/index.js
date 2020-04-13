import logger from './logger'
import plutusService from './services/plutus.service';
import fmpService from './services/fmp.service';
import { removeDuplicates } from './utils/helpers';

async function loadStocks() {
  const plutusStocks = await plutusService.getStocks();
  const fmpStocks = await fmpService.getStockList();
  const stocksToCreate = removeDuplicates(fmpStocks, plutusStocks, 'symbol');

  logger.debug(`Loading new stocks into plutus`)
  logger.debug(`Plutus stocks: ${plutusStocks.length}`)
  logger.debug(`FMP stocks: ${fmpStocks.length}`)
  logger.debug(`After removing duplicates: ${stocksToCreate.length}`)

  stocksToCreate.forEach(async (stock) => {
    try {
      await plutusService.createStock(stock);
    } catch (error) {
      logger.error(error);
    }
  });
}

async function loadStockData() {
  const plutusStocks = await plutusService.getStocks();
  logger.debug(`Loading new stock data`)
  logger.debug(`Plutus stocks: ${plutusStocks.length}`)
  plutusStocks.forEach(async (stock) => {
    try {
      const stockData = await fmpService.getStockData(stock.symbol);
      logger.debug({ stockData });
      // await plutusService.createStockData(stock.id, stockData);
    } catch (error) {
      logger.error(error.message);
    }
  });
}

async function loadAlgorithmValues() {
  logger.debug(`Loading new algorithm values`)
  try {
    await plutusService.aggregateAlgoritmValues('quarter');
  } catch (error) {
    logger.error(error);
  }
}

async function init() {
  try {
    await loadStocks();
    await loadStockData();
    // await loadAlgorithmValues();
  } catch (error) {
    process.exit(1)
  }
}

init()