import StockData from '../models/model.stockData';
import { handleResponse } from '../utils/helpers';

export const getAllStockData = async (req, res) => {

  StockData.find({}, (err, stocks) => {
    return handleResponse(err, stocks, req, res);
  });
}

export const getStockData = async (req, res) => {

  StockData.findById(req.params.id, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}

export const updateStockData = async (req, res) => {

  StockData.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}

export const deleteStockData = async (req, res) => {

  StockData.findByIdAndRemove(req.params.id, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}

export const createStockData = async (req, res) => {

  const { body } = req;

  StockData.createStockData(req.params.id, body, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}
