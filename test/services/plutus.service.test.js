import plutusService from '../../src/services/plutus.service';
import sinon from 'sinon';
import chai from 'chai';

const { expect } = chai;

describe('# plutus.service', function(){
    describe('## calculateAlgorithmValue', function(){
        it('## should return a value when given stock data and an algorithm', async function(){
            const algorithm = {
                formula: '(netIncome / shares) / (((assets - liabilities)/shares)/price)'
            }
            const stock = {
                latestStockData: {
                    netIncome: 55256000000,
                    assets: 340618000000,
                    liabilities: 251087000000,
                    shares: 4415040000,
                    price: 267.96
                }
            }
            const value = await plutusService.calculateAlgorithmValue(stock, algorithm);
            expect(value).to.exist
        });
    })
})