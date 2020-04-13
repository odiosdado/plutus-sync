import axios from 'axios';
import config from '../constants/config';
import logger from '../logger';

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
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

    async createAlgorithmValue(algorithmId, algorithmValue) {
        const response = await this.instance.post(`algorithms/${algorithmId}/algorithm-values`, algorithmValue);
        return response.data;
    }

    async aggregateAlgoritmValues(schedule) {
        const algorithms = await this.getAlgorithms(schedule);
        const stocks = await this.getStocks();

        stocks.forEach((stock) => {
            algorithms.forEach(async (algorithm) => {
                if (algorithm.allStocks || algorithm.getStocks().includes(stock.id)) {
                    console.log({ stock, algorithm })
                    const algorithmValue = await this.calculateAlgorithmValue(stock, algorithm);
                    console.log({ 'id': algorithm.id, algorithmValue });
                    await this.createAlgorithmValue(algorithm.id, algorithmValue)
                }
            });
        });
    }

    async calculateAlgorithmValue(stock, algorithm) {
        const { latestStockData } = stock;
        const { formula } = algorithm;
        const value = await this.getValueFromFormula(latestStockData, formula);
        const algorithmValue = {
            value,
            stockData: latestStockData.id
        }
        console.log({ algorithmValue })
        return algorithmValue;
    }

    async getValueFromFormula(stockData, formula) {
        let codeBlock = '';
        for(let key in stockData) {
            if(stockData.hasOwnProperty(key) && formula.includes(key)) {
                const val = stockData[key];
                console.log({ key, val });
                codeBlock += ` const ${key}=${parseFloat(val)};`;
            }
        }
        let value = null;
        codeBlock += ` value = ${formula}`;
        console.log(codeBlock);
        try {
            eval(codeBlock);
        } catch (error) {
            console.error(error);
        }
        return value;
    }
}

const plutusService = new PlutusService();
export default plutusService;