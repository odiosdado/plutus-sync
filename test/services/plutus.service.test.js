import plutusService from '../../src/services/plutus.service';
import sinon from 'sinon';
import chai from 'chai';

const { expect } = chai;

describe('# plutus.service', function(){
    describe('## aggregateAlgoritmValues', function(){
        it('## should create algorthim values when given a shedule', async function(){
            const stocks = [
                {
                    "name": "Apple",
                    "symbol": "AAPL",
                    "createdAt": "2020-04-12T16:00:32.987Z",
                    "updatedAt": "2020-04-12T16:03:49.827Z",
                    "latestStockData": {
                        "netIncome": "55256000000",
                        "assets": "340618000000",
                        "liabilities": "251087000000",
                        "shares": "4415040000",
                        "price": "267.96",
                        "stock": "5e933b200d75acc151c65205",
                        "createdAt": "2020-04-12T16:03:49.808Z",
                        "updatedAt": "2020-04-12T16:03:49.808Z",
                        "id": "5e933be59a6accc16ef76cb2"
                    },
                    "id": "5e933b200d75acc151c65205"
                }
            ];
            const algorithms = [{
                "allStocks": true,
                "stocks": [],
                "name": "plutus",
                "formula": "(netIncome / shares) / (((assets - liabilities)/shares)/price)",
                "schedule": "daily",
                "user": "5e8bf7251b3bb42d41c01d5e",
                "createdAt": "2020-04-12T01:48:41.495Z",
                "updatedAt": "2020-04-12T01:48:41.495Z",
                "id": "5e927379bb804fae1714983c"
            }];
            const algorithmValue = {
                "value": {
                    "$numberDecimal": "23456"
                },
                "stockData": "5e8d38e651399f8ad7635af7",
                "algorithm": "5e8bf803d741d97e1660d1b6",
                "createdAt": "2020-04-12T18:30:55.418Z",
                "updatedAt": "2020-04-12T18:30:55.418Z",
                "id": "5e935e5fa20b37c984b77e7a"
            };
            const schedule = 'quarterly';
            sinon.stub(plutusService,'getStocks').resolves(stocks);
            sinon.stub(plutusService,'getAlgorithms').resolves(algorithms);
            sinon.stub(plutusService,'createAlgorithmValue').resolves(algorithmValue);
            await plutusService.aggregateAlgoritmValues(schedule)
        });
    })
    describe('## calculateAlgorithmValue', function(){
        it('## should return a value when given stock data and an algorithm', async function(){
            const algorithm = {
                //formula: '(netIncome / shares) / (((assets - liabilities)/shares)/price)'
                formula: 'data'
            }
            const stock =  {
                "name": "Apple",
                "symbol": "AAPL",
                "createdAt": "2020-04-12T16:00:32.987Z",
                "updatedAt": "2020-04-12T16:03:49.827Z",
                "latestStockData": {
                    "netIncome": "55256000000",
                    "assets": "340618000000",
                    "liabilities": "251087000000",
                    "shares": "4415040000",
                    "price": "267.96",
                    "stock": "5e933b200d75acc151c65205",
                    "createdAt": "2020-04-12T16:03:49.808Z",
                    "updatedAt": "2020-04-12T16:03:49.808Z",
                    "id": "5e933be59a6accc16ef76cb2"
                },
                "id": "5e933b200d75acc151c65205"
            }
            const value = await plutusService.calculateAlgorithmValue(stock, algorithm);
            expect(value).to.exist
        });
    })
})