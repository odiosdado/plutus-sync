const User = require('../models/model.user');

exports.getUser = (req, res, next) => {  

  User.findById(req.params.id, function (err, user) {
    if(err) {
      return next(err);
    }
    if(user){
      res.send(user);
    } else {
      res.status(404).send({message: `User not found for ${decode.sub}`});
    }
  });
}

exports.updateUser = (req, res, next) => {

  User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function(err, user) {
    if(err) {
      return next(err);
    }
    if(user){
      res.send(user);
    } else {
      res.status(404).send({message: `User not found for ${req.params.id}`});
    }
  });
}

exports.deleteUser = (req, res, next) => {

  User.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      return next(err);
    }
    res.send();
  });
}

exports.addVehicle = (req, res, next) => {

  User.findByIdAndUpdate(req.params.id,
    {$push: {vehicles: req.body}},
    {new: true},
    function(err, user) {
      if(err){
        return next(err)
      }
      res.send(user);
  });
}

exports.deleteVehicle = (req, res, next) => {
  
  User.findByIdAndUpdate(req.params.id,
    {$pull: {vehicles: {'_id': req.params.vehicle_id}}},
    {new: true},
    function(err, user) {
      if(err){
        console.log(err)
        return next(err)
      }
      if(user){
        res.send(user);
      } else {
        res.status(404).send({message: `User not found for ${req.params.id}`});
      }
  });
}

exports.addBuild = (req, res, next) => {
  User.collection.update({
    "_id" : req.params.id,
    "vehicles._id": req.params.vehicle_id
  },
  {
    $push : { "vehicles.$$.builds" : req.body}
  },
  false,
  true
  );

  /*User.findByIdAndUpdate(req.params.id,
    {$push: {vehicles.$.brands: req.body}},
    {new: true},
    function(err, user) {
      if(err){
        return next(err)
      }
      res.send(user);
  });*/
}