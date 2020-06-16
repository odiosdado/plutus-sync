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

  for(const stock of stocksToCreate) {
    try {
      await plutusService.createStock(stock);
    } catch (error) {
      logger.error(error);
    }
  };
}

async function loadStockData() {
  const plutusStocks = await plutusService.getStocks();
  logger.debug(`Loading new stock data`)
  logger.debug(`Plutus stocks: ${plutusStocks.length}`)
  for(const stock of plutusStocks) {
    try {
      const stockData = await fmpService.getStockData(stock.symbol);
      await plutusService.createStockData(stock.id, stockData);
    } catch (error) {
      logger.error(error.message);
    }
  };
}

async function loadAlgorithmValues() {
  logger.debug(`Loading new algorithm values`)
  try {
    await plutusService.aggregateAlgoritmValues('quarterly');
  } catch (error) {
    logger.error(error);
  }
}

async function init() {
  try {
    await loadStocks();
    await loadStockData();
    await loadAlgorithmValues();
  } catch (error) {
    logger.error(error.message);
    logger.error(error.stack);
  }
}

init();