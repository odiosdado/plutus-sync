import axios from 'axios';
import config from '../constants/config';
import logger from '../logger';

class FmpService {
    constructor() {
        this.instance = axios.create({
            baseURL: config.fmpApi.baseUrl
        });
        this.instance.interceptors.response.use(
            response => {
                if (response.data['Error Message']) {
                    throw new Error(response.data['Error Message']);
                }
                return response;
            },
            error => {
                throw new Error(error.response.data.message)
            }
        );
        this.instance.interceptors.request.use((config) => {
            config.params = config.params || {};
            config.params['apikey'] = process.env.FMP_API_KEY;
            return config;
        });
    }

    async getStockList() {
        const response = await this.instance.get('company/stock/list');
        return response.data['symbolsList'];
    }

    async getIncomeStatement(symbol) {
        logger.debug(`financials/income-statement/${symbol}`);
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
        try {
            logger.debug(`getStockData:: ${symbol}`)
            const incomeStatement = await this.getIncomeStatement(symbol);
            const balanceSheet = await this.getBalanceSheet(symbol, 'quarter');
            const enterpriseValue = await this.getEnterpriseValue(symbol, 'quarter');
            const price = await this.getStockPrice(symbol);

            return {
                netIncome: incomeStatement.financials[0]['Net Income'],
                assets: balanceSheet.financials[0]['Total assets'],
                liabilities: balanceSheet.financials[0]['Total liabilities'],
                shares: enterpriseValue.enterpriseValues[0]['Number of Shares'],
                price: price.price
            }
        } catch (error) {
            logger.error(`getStockData:: ${symbol} ${error.message}`)
            logger.error(error)
        }
    }
}

const fmpService = new FmpService();
export default fmpService;