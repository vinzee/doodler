'use strict';

/**
 * Module dependencies
 */
var doodlesPolicy = require('../policies/doodles.server.policy'),
  doodles = require('../controllers/doodles.server.controller');

module.exports = function(app) {
  // Doodles Routes
  app.route('/api/doodles').all(doodlesPolicy.isAllowed)
    .get(doodles.list)
    .post(doodles.create);

  app.route('/api/doodles/:doodleId').all(doodlesPolicy.isAllowed)
    .get(doodles.read)
    .put(doodles.update)
    .delete(doodles.delete);

  // Finish by binding the Doodle middleware
  app.param('doodleId', doodles.doodleByID);
};
