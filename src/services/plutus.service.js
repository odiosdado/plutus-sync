import axios from 'axios';
import config from '../constants/config';

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

class PlutusService {
    constructor() {
        this.instance = axios.create({
            baseURL: config.plutusApi.baseUrl,
            timeout: 1000
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
        algorithms.forEach((algorithm) => {
            if (algorithm.allStocks) {

            }
        });
    }

    async calculateAlgorithmValue(stock, algorithm) {
        const { latestStockData } = stock;
        const { formula } = algorithm;
        let codeBlock = '';
        for(let key in latestStockData) {
            if(latestStockData.hasOwnProperty(key)) {
                const val = latestStockData[key];
                console.log({ key, val });
                codeBlock += ` const ${key}=${val};`;
            }
        }
        let value = null;
        codeBlock += ` value = ${formula}`;
        console.log(codeBlock);
        eval(codeBlock);
        console.log({ value })
        return value;
    }
}

const plutusService = new PlutusService();
export default plutusService;