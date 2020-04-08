import Stock from '../models/model.stock';
import StockData from '../models/model.stockData';
import { handleResponse } from '../utils/helpers';

export const getStocks = async (req, res) => {

  const { query } = req;

  Stock.find(query, (err, stocks) => {
    return handleResponse(err, stocks, req, res);
  });
}

export const getStock = async (req, res) => {

  Stock.findById(req.params.id, (err, stock) => {
    return handleResponse(err, stock, req, res);
  });
}

export const createStock = async (req, res) => {

  const { body } = req;

  Stock.createStock(body, (err, stock) => {
    return handleResponse(err, stock, req, res);
  });
}

export const updateStock = async (req, res) => {

  Stock.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, stock) => {
    return handleResponse(err, stock, req, res);
  });
}

export const deleteStock = async (req, res) => {

  Stock.findByIdAndRemove(req.params.id, (err, stock) => {
    return handleResponse(err, stock, req, res);
  });
}

export const createStockData = async (req, res) => {

  const { body } = req;

  StockData.createStockData(req.params.id, body, (err, stock) => {
    return handleResponse(err, stock, req, res);
  });
}

export const getStockData = async (req, res) => {

  StockData.find({ stock : req.params.id }, (err, stocks) => {
    return handleResponse(err, stocks, req, res);
  });
}
