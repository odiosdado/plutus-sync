import User from '../models/model.user';
import Algorithm from '../models/model.algorithm';
import { handleResponse } from '../utils/helpers';

export const getUser = async (req, res) => {

  User.findById(req.params.id, (err, user) => {
    return handleResponse(err, user, req, res);
  });
}

export const updateUser = async (req, res) => {

  User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, user) => {
    return handleResponse(err, user, req, res);
  });
}

export const deleteUser = async (req, res) => {

  User.findByIdAndRemove(req.params.id, (err, user) => {
    return handleResponse(err, user, req, res);
  });
}

export const getUserItems = async (req, res) => {

  Item.find({ user: req.params.id }, (err, items) => {
    return handleResponse(err, items, req, res);
  });
}

export const createUserAlgorithm = async (req, res) => {

  const userId = req.params.id;
  const { body } = req;

  Algorithm.createAlgorithm(userId, body, (err, item) => {
    return handleResponse(err, item, req, res);
  });
}

export const getUserAlgorithms = async (req, res) => {

  Algorithm.find({ user: req.params.id }, (err, algorithms) => {
    return handleResponse(err, algorithms, req, res);
  });
}