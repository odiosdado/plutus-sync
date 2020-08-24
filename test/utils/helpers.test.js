import * as helpers from '../../src/utils/helpers';
import sinon from 'sinon';
import chai from 'chai';
import moment from "moment";

const { expect } = chai;

describe('# helpers', function(){
    describe('## getMostRecentQuarter', function(){
        it('## should return the most recent quarter report when given a date', async function () {
            const financials = [
                {
                    "date": "2020-06-27"
                },
                {
                    "date": "2020-03-28"
                },
                {
                    "date": "2019-12-28"
                },
                {
                    "date": "2019-09-28"
                },
                {
                    "date": "2019-06-29"
                },
            ];
            const calcDate = "2020-08-23";
            const report = helpers.getMostRecentQuarter(calcDate, financials);
            expect(report.date).eql("2020-06-27");
        });
        it('## should return the most recent quarter report when given a date in the past', async function () {
            const financials = [
                {
                    "date": "2020-06-27"
                },
                {
                    "date": "2020-03-28"
                },
                {
                    "date": "2019-12-28"
                },
                {
                    "date": "2019-09-28"
                },
                {
                    "date": "2019-06-29"
                },
            ];
            const calcDate = "2019-08-23";
            const report = helpers.getMostRecentQuarter(calcDate, financials);
            expect(report.date).eql("2019-06-29");
        });
    })
    describe('## getMostRecentBusinessDate', function(){
        it('## should return Friday when given a date that is a Monday', async function () {
            const calcDate = "2020-08-23";
            const date = helpers.getMostRecentBusinessDate(calcDate);
            expect(date.isSame(moment("2020-08-21"))).eql(true);
        });
        it('## should return the same day when given a date that is a workday', async function () {
            const calcDate = "2020-08-24";
            const date = helpers.getMostRecentBusinessDate(calcDate);
            expect(date.isSame(moment("2020-08-24"))).eql(true);
        });
    })
    describe('## getMostRecentBusinessDate', function(){
        it('## should return a start date and end date 5 days difference', async function () {
            const calcDate = "2020-08-23";
            const range = helpers.calculateStockPriceDateRange(calcDate);
            expect(range.startDate.isSame(moment("2020-08-16"))).eql(true);
            expect(range.endDate.isSame(moment("2020-08-21"))).eql(true);
        });
    })
    describe('## splitIntoEqualChunks', function(){
        it('## should return an array of length of equal to the square root of the passed in array', async function () {
            const stocks = [
                {
                    id: '123',
                },
                {
                    id: '123',
                },
                {
                    id: '123',
                },
                {
                    id: '123',
                },
                {
                    id: '123',
                },
                {
                    id: '123',
                },
                {
                    id: '123',
                },
                {
                    id: '123',
                }
                ,
                {
                    id: '123',
                },
                {
                    id: '123',
                }
                ,
                {
                    id: '123',
                }
            ];
            const chunks = helpers.splitIntoEqualChunks(stocks);
            expect(chunks.length).eql(Math.floor(Math.sqrt(stocks.length)));
        });
    })
})