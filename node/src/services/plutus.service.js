import axios from 'axios';
import config from '../constants/config';
import logger from '../logger';

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log({ response })
    console.log(error)
    return Promise.reject(error);
  });

class PlutusService {
    constructor() {
        this.instance = axios.create({
            baseURL: config.plutusApi.baseUrl
        });
    }
    
    async getValueFromFormula(stockData, formula) {
        let codeBlock = '';
        for(let key in stockData) {
            if(stockData.hasOwnProperty(key) && formula.includes(key)) {
                const val = stockData[key];
                codeBlock += ` const ${key}=${parseFloat(val)};`;
            }
        }
        let value = null;
        codeBlock += ` value = ${formula}`;
        logger.debug(`codeBlock: ${codeBlock}`);
        try {
            eval(codeBlock);
        } catch (error) {
            logger.error({ message: error.message, stack: error.stack });
        }
        return value;
    }
}

const plutusService = new PlutusService();
export default plutusService;