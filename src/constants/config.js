import dotenv from 'dotenv'
dotenv.config();

const config = {
  
  plutusApi: {
    baseUrl : process.env.PLUTUS_BASE_URL,
  },

  fmpApi: {
    baseUrl : process.env.FMP_BASE_URL,
  },

  winston : {
    console : {
      level : 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }
  }
};
export default config;