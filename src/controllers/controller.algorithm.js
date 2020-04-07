import Algorithm from '../models/model.algorithm';
import { handleResponse } from '../utils/helpers';

export const getUserAlgorithms = async (req, res) => {

  Algorithm.find({ user: req.params.id }, (err, algorithms) => {
    return handleResponse(err, algorithms, req, res);
  });
}

export const getAlgorithm = async (req, res) => {

  Algorithm.findById(req.params.id, (err, algorithm) => {
    return handleResponse(err, algorithm, req, res);
  });
}

export const createUserAlgorithm = async (req, res) => {

  const userId = req.params.id;
  const { body } = req;

  Algorithm.createAlgorithm(userId, body, (err, algorithm) => {
    return handleResponse(err, algorithm, req, res);
  });
}

export const updateAlgorithm = async (req, res) => {

  Algorithm.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, algorithm) => {
    return handleResponse(err, algorithm, req, res);
  });
}

export const deleteAlgorithm = async (req, res) => {

  Algorithm.findByIdAndRemove(req.params.id, (err, algorithm) => {
    return handleResponse(err, algorithm, req, res);
  });
}