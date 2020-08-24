import axios from 'axios';
import config from '../constants/config';
import logger from '../logger';
import { getMostRecentQuarter, calculateStockPriceDateRange } from '../utils/helpers';

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

    async getIncomeStatement(symbol, period) {
        logger.debug(`financials/income-statement/${symbol}`);
        const response = await this.instance.get(`financials/income-statement/${symbol}?period=${period}`);
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

    async getHistoricalStockPrice(symbol, range) {
        const url = `historical-price-full/${symbol}?from=${range.startDate.format("YYYY-MM-DD")}&to=${range.endDate.format("YYYY-MM-DD")}`;
        console.log({ url })
        const response = await this.instance.get(url);
        return response.data;
    }

    async getStockData(date, symbol) {
        try {
            logger.debug(`getStockData:: ${symbol}`)
            const range = calculateStockPriceDateRange(date);
            logger.debug(`stock pice date range:: ${range}`)
            const incomeStatement = await this.getIncomeStatement(symbol, 'quarter');
            const balanceSheet = await this.getBalanceSheet(symbol, 'quarter');
            const enterpriseValue = await this.getEnterpriseValue(symbol, 'quarter');
            const prices = await this.getHistoricalStockPrice(symbol, range);
            if (!incomeStatement.financials) {
                logger.debug(`No stock data found for : ${symbol}`)
                return null;
            }
            if (!prices.historical) {
                logger.debug(`No stock price found for : ${symbol} using range ${range}`)
                return null;
            }
            const lastQuarterIncomeStatement = getMostRecentQuarter(date, incomeStatement.financials);
            if (!lastQuarterIncomeStatement) {
                logger.debug(`No income statement found for : ${symbol} within the last quarter of ${date}`)
                return null;
            }
            const lastQuarterBalanceSheet = getMostRecentQuarter(date, balanceSheet.financials);
            const lastQuarterEnterpriseValue = getMostRecentQuarter(date, enterpriseValue.enterpriseValues);

            console.log({ })
            return {
                netIncome: lastQuarterIncomeStatement['Net Income'],
                assets: lastQuarterBalanceSheet['Total assets'],
                liabilities: lastQuarterBalanceSheet['Total liabilities'],
                shares: lastQuarterEnterpriseValue['Number of Shares'],
                price: prices.historical[0].close,
                createdAt: date,
            }
        } catch (error) {
            logger.error(`getStockData:: ${symbol} ${error.message}`)
            logger.error(error.stack)
        }
    }
}

const fmpService = new FmpService();
export default fmpService;