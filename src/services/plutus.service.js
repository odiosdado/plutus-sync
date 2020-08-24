import axios from 'axios';
import config from '../constants/config';
import logger from '../logger';

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log({ response })
    console.log(error)
    return Promise.reject(error);
  });

class PlutusService {
    constructor() {
        this.instance = axios.create({
            baseURL: config.plutusApi.baseUrl
        });
    }

    async getStocks() {
        const response = await this.instance.get('stocks');
        return response.data;
    }

    async createStock(stock) {
        const response = await this.instance.post('stocks', stock);
        return response.data;
    }

    async createStockData(stockId, stockData) {
        const url = `stocks/${stockId}/stock-data`;
        logger.debug({ 'createStockData:': { url, stockData }});
        const response = await this.instance.post(`stocks/${stockId}/stock-data`, stockData);
        return response.data;
    }

    async getAlgorithms(schedule) {
        let url = 'algorithms';
        if(schedule) {
            url += `?schedule=${schedule}`
        }
        const response = await this.instance.get(url);
        return response.data;
    }

    async getStockData(date) {
        const response = await this.instance.get(`stock-data?date=${date.format('YYYY-MM-DD')}`);
        return response.data;
    }

    async createAlgorithmValue(algorithmId, algorithmValue) {
        const response = await this.instance.post(`algorithms/${algorithmId}/algorithm-values`, algorithmValue);
        return response.data;
    }

    async aggregateAlgoritmValues(data, schedule, date) {
        const algorithms = await this.getAlgorithms(schedule);
        //const stockData = await this.getStockData(date);
        //for (const data of stockData) {
            for (const algorithm of algorithms) {
                if (algorithm.allStocks || algorithm.getStocks().includes(data.stock.id)) {
                    try {
                        const algorithmValue = await this.calculateAlgorithmValue(data, algorithm, date);
                        logger.debug({ 'symbol': data.stock.symbol, 'algorithm value': algorithmValue });
                        await this.createAlgorithmValue(algorithm.id, algorithmValue, date);
                    } catch (error) {
                        logger.error(error.message)
                    }
                }
            };
        //};
    }

    async calculateAlgorithmValue(data, algorithm, date) {
        const { formula } = algorithm;
        const value = await this.getValueFromFormula(data, formula);
        const algorithmValue = {
            value,
            stockData: data.id,
            createdAt: date
        }
        return algorithmValue;
    }

    async getValueFromFormula(stockData, formula) {
        let codeBlock = '';
        for(let key in stockData) {
            if(stockData.hasOwnProperty(key) && formula.includes(key)) {
                const val = stockData[key];
                codeBlock += ` const ${key}=${parseFloat(val)};`;
            }
        }
        let value = null;
        codeBlock += ` value = ${formula}`;
        logger.debug(`codeBlock: ${codeBlock}`);
        try {
            eval(codeBlock);
        } catch (error) {
            logger.error({ message: error.message, stack: error.stack });
        }
        return value;
    }
}

const plutusService = new PlutusService();
export default plutusService;