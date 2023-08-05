import moment, { months } from "moment";
import logger from '../logger'
import config from "../constants/config";

export const internalError = (error, res) => {
    if (error.message) {
        return res.status(500).send({ message: error.message });
    }
    return res.status(500).send({ message: error });
}

export const documentFound = (doc, req, res) => {
    if (req.method === 'POST') {
        return res.status(201).send(doc);
    }
    if (req.method === 'DELETE') {
        return res.status(204).send();
    }
    return res.status(200).send(doc);
}

export const handleResponse = (err, doc, req, res) => {
    if (err) {
        return internalError(err, res);
    }
    if (doc) {
        return documentFound(doc, req, res);
    }
    return res.status(404).send({ message: `${req.params.id} not found` });
}

export const removeDuplicates = (arrayA, arrayB, prop) => {
    return arrayA.filter(elem => {
        return (arrayB.find(el => el[prop] === elem[prop]) ? null : elem)
    });
}

export const getMostRecentQuarter = (calcDate, financials) => {
    const currentDate = moment(calcDate);
    for(const fin of financials) {
        const finDate = moment(fin.date);
        const diff = moment.duration(currentDate.diff(finDate));
        if(diff.years() === 0 && (diff.months() > 0 && diff.months() < 4)) {
            return fin;
        }
    }
}

export const calculateStockPriceDateRange = (calcDate) => {
    const endDate = getMostRecentBusinessDate(calcDate);
    const startDate = moment(endDate).subtract(5, 'days');

    return {
        startDate,
        endDate
    }
}

export const getMostRecentBusinessDate = (calcDate) => {
    let workday = moment(calcDate);
    let day = workday.day();
    switch (day) {
    case 6:
        day += 1;
        break;
    case 0:
        day += 2; 
        break;
    default:
        day = 0;
        break;
    }
    return workday.subtract(day, 'days');
}

export const getMonthlyDatesBetweenRange = (startDate, endDate) => {
    logger.debug(`getMonthlyDatesBetweenRange() startDate=${startDate}, endDate=${endDate}`)
    if(!startDate || !endDate) {
        const currDate = moment();
        logger.debug(`dates were null, returning range of current date: ${currDate}`)
        return [currDate.toDate()]
    }
    const dates = [];
    const currDate = moment(startDate).startOf('day');
    const lastDate = moment(endDate).startOf('day');
    logger.debug(`currDate=${currDate}, lastDate=${lastDate}`)
    dates.push(currDate.toDate());
    while(currDate.add(1, 'months').diff(lastDate) <= 0) {
        dates.push(currDate.clone().toDate());
    }
    logger.debug(`dates=${dates}`)
    return dates;
}

export const splitIntoEqualChunks = (stocks) => {
    const chunks = [];
    var i,j,temp,chunk = Math.floor(Math.sqrt(stocks.length));
    for (i=0,j=stocks.length; i<j; i+=chunk) {
        temp = stocks.slice(i,i+chunk);
        chunks.push(temp)
    }
    return chunks;
}

export const formatFillingDate = (date) => {
    return moment(date).format("YYYY-MM-DD")
}

export const estimatedRunTime = (numOfStocks) => {
    const numOfApiCalls = 8
    const runtimeInsec = (numOfStocks * numOfApiCalls) / config.fmpApi.maxRequestsPerSecond
    return moment.utc(runtimeInsec*1000).format('HH:mm:ss');
}