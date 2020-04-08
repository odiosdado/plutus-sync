import AlgorithmValue from '../models/model.algorithmValue';
import { handleResponse } from '../utils/helpers';

export const getAlgorithmValues = async (req, res) => {

  AlgorithmValue.find({ algorithm: req.params.id }, (err, algorithmValue) => {
    return handleResponse(err, algorithmValue, req, res);
  });
}

export const getAllAlgorithmValues = async (req, res) => {

  AlgorithmValue.find({}, (err, algorithmValues) => {
    return handleResponse(err, algorithmValues, req, res);
  });
}

export const deleteAlgorithmValue = async (req, res) => {

  AlgorithmValue.findByIdAndRemove(req.params.id, (err, algorithmValue) => {
    return handleResponse(err, algorithmValue, req, res);
  });
}

export const createAlgorithmValue = async (req, res) => {

  const algorithmId = req.params.id;
  const { body } = req;

  AlgorithmValue.createAlgorithmValue(algorithmId, body, (err, algorithmValue) => {
    return handleResponse(err, algorithmValue, req, res);
  });
}