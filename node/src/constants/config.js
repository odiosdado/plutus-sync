import dotenv from 'dotenv'
dotenv.config();

const config = {
  
  plutusApi: {
    baseUrl : process.env.PLUTUS_BASE_URL,
  },

  fmpApi: {
    baseUrl : process.env.FMP_BASE_URL,
    maxRequestsPerSecond: 3,
    apiKey: process.env.FMP_API_KEY
  },

  winston : {
    console : {
      level : 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }
  },

  plutusFormula: "netIncome <= 0 ? 0 : (netIncome / shares) / (((assets - liabilities)/shares)/price)",

  bigQuery: {
    tableId: 'stocks',
    datasetId: 'plutus_sync',
    keyPath: process.env.GOOGLE_APPLICATION_CREDENTIALS
  }
};
export default config;