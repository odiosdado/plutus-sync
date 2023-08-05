import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import moment from 'moment';
import config from '../constants/config';
import logger from '../logger';
import { getMostRecentQuarter, calculateStockPriceDateRange, formatFillingDate } from '../utils/helpers';

const { fmpApi } = config;

class FmpService {
    constructor() {
        this.instance = rateLimit(axios.create({ baseURL: fmpApi.baseUrl }), 
        { maxRequests: fmpApi.maxRequestsPerSecond, perMilliseconds: 1000 });
        this.instance.interceptors.request.use((config) => {
            config.params = config.params || {};
            config.params['apikey'] = process.env.FMP_API_KEY
            return config;
        });
        this.instance.interceptors.response.use(
            response => {
                if (response.data['Error Message']) {
                    throw new Error(response.data['Error Message']);
                }
                return response;
            },
            function (error) {
                if (error.response && error.response.data && error.response.data['Error Message']) {
                    throw new Error(`${error.response.data['Error Message']} at ${error.config.url}`);
                }
                throw error;
            }
        );
    }

    async getStockList() {
        const response = await this.instance.get('stock/list');
        return response.data
    }

    async getIncomeStatement(symbol, period) {
        logger.debug(`income-statement/${symbol}`);
        const response = await this.instance.get(`income-statement/${symbol}?period=${period}`);
        return response.data;
    }

    async getBalanceSheet(symbol, period) {
        const response = await this.instance.get(`balance-sheet-statement/${symbol}?period=${period}`);
        return response.data;
    }

    async getEnterpriseValue(symbol, period) {
        const response = await this.instance.get(`enterprise-values/${symbol}?period=${period}`);
        return response.data;
    }

    async getStockPrice(symbol) {
        const response = await this.instance.get(`quote/${symbol}`);
        return response.data;
    }

    async getHistoricalStockPrice(symbol, range) {
        const url = `historical-price-full/${symbol}?from=${range.startDate.format("YYYY-MM-DD")}&to=${range.endDate.format("YYYY-MM-DD")}`;
        const response = await this.instance.get(url);
        return response.data;
    }
    async getFinancialDataForAllQuarters(symbol) {
        try {
            logger.debug(`getFinancialDataForAllQuarters:: ${symbol}`)
            const incomeStatements = await this.getIncomeStatement(symbol, 'quarter');
            const balanceSheet = await this.getBalanceSheet(symbol, 'quarter');
            const enterpriseValue = await this.getEnterpriseValue(symbol, 'quarter');
            if (!incomeStatements) {
                logger.debug(`Skipped: No income statements found for : ${symbol}`)
                return null;
            }
            if (!balanceSheet && balanceSheet.length == 0) {
                logger.debug(`Skipped: No balance sheets found for : ${symbol} using range ${range}`)
                return null;
            }
            if (!enterpriseValue && enterpriseValue.length == 0) {
                logger.debug(`Skipped: No enterprise value found for : ${symbol} using range ${range}`)
                return null;
            }
            return {
                incomeStatements,
                balanceSheet,
                enterpriseValue
            }
        } catch (error) {
            logger.error(`Error getFinancialDataForAllQuarters:: ${symbol} ${error.message}`)
            logger.error(error.stack)
        }
    }

    async getFinancialDataFromMostRecentQuarter(date, financialData, symbol) {
        const { incomeStatements, balanceSheet, enterpriseValue } = financialData;
        const lastQuarterIncomeStatement = getMostRecentQuarter(date, incomeStatements);
        if (!lastQuarterIncomeStatement) {
            logger.debug(`Skipped: Unable to find the most recent income statement for : ${symbol} within the last quarter of ${date}`)
            return null;
        }
        const lastQuarterBalanceSheet = getMostRecentQuarter(date, balanceSheet);
        if (!lastQuarterBalanceSheet) {
            logger.debug(`Skipped: Unable to find the most recent balance sheet for: ${symbol} within the last quarter of ${date}`)
            return null;
        }
        const lastQuarterEnterpriseValue = getMostRecentQuarter(date, enterpriseValue);
        if (!lastQuarterEnterpriseValue) {
            logger.debug(`Skipped: Unable to find the most recent enterprise value for : ${symbol} within the last quarter of ${date}`)
            return null;
        }

        return {
            fillingDate: formatFillingDate(lastQuarterIncomeStatement.fillingDate),
            fillingPeriod: lastQuarterIncomeStatement.period,
            fillingLink: lastQuarterIncomeStatement.link,
            netIncome: lastQuarterIncomeStatement.netIncome,
            assets: lastQuarterBalanceSheet.totalAssets,
            liabilities: lastQuarterBalanceSheet.totalLiabilities,
            shares: lastQuarterEnterpriseValue.numberOfShares,
        }
    }

    async getStockPriceByDate(date, symbol) {
        logger.debug(`getStockPriceByDate:: ${symbol}`)
        const range = calculateStockPriceDateRange(date);
        logger.debug(`stock pice date range::`, range );
        const prices = await this.getHistoricalStockPrice(symbol, range);
        if (!prices.historical) {
            logger.debug(`Skipped: No stock price found for : ${symbol} using range ${range}`)
            return null;
        }
        return prices.historical[0].close
    }

    async getStockData(date, symbol) {
        try {
            logger.debug(`getStockData:: ${symbol}`)
            const range = calculateStockPriceDateRange(date);
            logger.debug(`stock pice date range:: ${range}`)

            const incomeStatements = await this.getIncomeStatement(symbol, 'quarter');
            const balanceSheet = await this.getBalanceSheet(symbol, 'quarter');
            const enterpriseValue = await this.getEnterpriseValue(symbol, 'quarter');
            const prices = await this.getHistoricalStockPrice(symbol, range);
            if (!incomeStatements) {
                logger.debug(`No income statements found for : ${symbol}`)
                return null;
            }
            if (!balanceSheet && balanceSheet.length == 0) {
                logger.debug(`No balance sheets found for : ${symbol} using range ${range}`)
                return null;
            }
            if (!enterpriseValue && enterpriseValue.length == 0) {
                logger.debug(`No enterprise value found for : ${symbol} using range ${range}`)
                return null;
            }
            if (!prices.historical) {
                logger.debug(`No stock price found for : ${symbol} using range ${range}`)
                return null;
            }
            const lastQuarterIncomeStatement = getMostRecentQuarter(date, incomeStatements);
            if (!lastQuarterIncomeStatement) {
                logger.debug(`Unable to find the most recent income statement for : ${symbol} within the last quarter of ${date}`)
                return null;
            }
            const lastQuarterBalanceSheet = getMostRecentQuarter(date, balanceSheet);
            if (!lastQuarterBalanceSheet) {
                logger.debug(`Unable to find the most recent balance sheet for: ${symbol} within the last quarter of ${date}`)
                return null;
            }
            const lastQuarterEnterpriseValue = getMostRecentQuarter(date, enterpriseValue);
            if (!lastQuarterEnterpriseValue) {
                logger.debug(`Unable to find the most recent enterprise value for : ${symbol} within the last quarter of ${date}`)
                return null;
            }

            return {
                fillingDate: formatFillingDate(lastQuarterIncomeStatement.fillingDate),
                fillingPeriod: lastQuarterIncomeStatement.period,
                fillingLink: lastQuarterIncomeStatement.link,
                netIncome: lastQuarterIncomeStatement.netIncome,
                assets: lastQuarterBalanceSheet.totalAssets,
                liabilities: lastQuarterBalanceSheet.totalLiabilities,
                shares: lastQuarterEnterpriseValue.numberOfShares,
                price: prices.historical[0].close,
                valueDate: date.toISOString().slice(0, -1),
            }
        } catch (error) {
            logger.error(`getStockData:: ${symbol} ${error.message}`)
            logger.error(error.stack)
        }
    }
}

const fmpService = new FmpService();
export default fmpService;