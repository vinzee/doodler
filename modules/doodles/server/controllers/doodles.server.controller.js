'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Doodle = mongoose.model('Doodle'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Doodle
 */
exports.create = function(req, res) {
  var doodle = new Doodle(req.body);
  doodle.user = req.user;

  doodle.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doodle);
    }
  });
};

/**
 * Show the current Doodle
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var doodle = req.doodle ? req.doodle.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  doodle.isCurrentUserOwner = req.user && doodle.user && doodle.user._id.toString() === req.user._id.toString();

  res.jsonp(doodle);
};

/**
 * Update a Doodle
 */
exports.update = function(req, res) {
  var doodle = req.doodle;

  doodle = _.extend(doodle, req.body);

  doodle.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doodle);
    }
  });
};

/**
 * Delete an Doodle
 */
exports.delete = function(req, res) {
  var doodle = req.doodle;

  doodle.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doodle);
    }
  });
};

/**
 * List of Doodles
 */
exports.list = function(req, res) {
  Doodle.find().sort('-created').populate('user', 'displayName').exec(function(err, doodles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doodles);
    }
  });
};

/**
 * Doodle middleware
 */
exports.doodleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Doodle is invalid'
    });
  }

  Doodle.findById(id).populate('user', 'displayName').exec(function (err, doodle) {
    if (err) {
      return next(err);
    } else if (!doodle) {
      return res.status(404).send({
        message: 'No Doodle with that identifier has been found'
      });
    }
    req.doodle = doodle;
    next();
  });
};
