import axios from 'axios';
import config from '../constants/config';

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

class FmpService {
    constructor() {
        this.instance = axios.create({
            baseURL: config.fmpApi.baseUrl,
            timeout: 1000
        });
    }

    async getStockList() {
        const response = await this.instance.get('company/stock/list');
        return response.data['symbolsList'];
    }

    async getIncomeStatement(symbol) {
        const response = await this.instance.get(`financials/income-statement/${symbol}`);
        return response.data;
    }

    async getBalanceSheet(symbol, period) {
        const response = await this.instance.get(`financials/balance-sheet-statement/${symbol}?period=${period}`);
        return response.data;
    }

    async getEnterpriseValue(symbol, period) {
        const response = await this.instance.get(`enterprise-value/${symbol}?period=${period}`);
        return response.data;
    }

    async getStockPrice(symbol) {
        const response = await this.instance.get(`stock/real-time-price/${symbol}`);
        return response.data;
    }

    async getStockData(symbol) {
        const incomeStatement = await this.getIncomeStatement(symbol);
        const balanceSheet = await this.getBalanceSheet(symbol, 'quarter');
        const enterpriseValue = await this.getEnterpriseValue(symbol, 'quarter');
        const price = await this.getStockPrice(symbol);

        return {
            netIncome: incomeStatement.financials[0]['Net Income'],
            assets: balanceSheet.financials[0]['Total assets'],
            liabilites: balanceSheet.financials[0]['Total liabilities'],
            shares: enterpriseValue.enterpriseValues[0]['Number of Shares'],
            price: price.price
        }
    }
}

const fmpService = new FmpService();
export default fmpService;