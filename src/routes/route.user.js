'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller.user');

var passport = require('passport');
require('../authentication/passport')();

//users
router.get('/:id', passport.authenticate('jwt', { session: false }), userController.getUser);
router.put('/:id', passport.authenticate('jwt', { session: false }), userController.updateUser);
router.delete('/:id', passport.authenticate('jwt', { session: false }), userController.deleteUser);

// vehicles
router.post('/:id/vehicles', passport.authenticate('jwt', { session: false }), userController.addVehicle);
router.delete('/:id/vehicles/:vehicle_id', passport.authenticate('jwt', { session: false }), userController.deleteVehicle);

//builds
router.post('/:id/vehicles/:vehicle_id/builds', passport.authenticate('jwt', { session: false }), userController.addBuild);

/*router.delete('/:id/vehicles/:vehicle_id/builds/:build_id', passport.authenticate('jwt', { session: false }), userController.deleteBuild);
router.put('/:id/vehicles/:vehicle_id/builds/:build_id', passport.authenticate('jwt', { session: false }), userController.updateBuild);

//parts
router.post('/:id/vehicles/:vehicle_id/builds/:build_id', passport.authenticate('jwt', { session: false }), userController.addPart);
router.delete('/:id/vehicles/:vehicle_id/builds/:build_id/parts/:part_id', passport.authenticate('jwt', { session: false }), userController.deletePart);
router.put('/:id/vehicles/:vehicle_id/builds/:build_id/parts/:part_id', passport.authenticate('jwt', { session: false }), userController.updatePart);*/

module.exports = router;