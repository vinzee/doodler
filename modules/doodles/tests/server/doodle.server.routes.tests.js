'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Doodle = mongoose.model('Doodle'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  doodle;

/**
 * Doodle routes tests
 */
describe('Doodle CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Doodle
    user.save(function () {
      doodle = {
        name: 'Doodle name'
      };

      done();
    });
  });

  it('should be able to save a Doodle if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doodle
        agent.post('/api/doodles')
          .send(doodle)
          .expect(200)
          .end(function (doodleSaveErr, doodleSaveRes) {
            // Handle Doodle save error
            if (doodleSaveErr) {
              return done(doodleSaveErr);
            }

            // Get a list of Doodles
            agent.get('/api/doodles')
              .end(function (doodlesGetErr, doodlesGetRes) {
                // Handle Doodles save error
                if (doodlesGetErr) {
                  return done(doodlesGetErr);
                }

                // Get Doodles list
                var doodles = doodlesGetRes.body;

                // Set assertions
                (doodles[0].user._id).should.equal(userId);
                (doodles[0].name).should.match('Doodle name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Doodle if not logged in', function (done) {
    agent.post('/api/doodles')
      .send(doodle)
      .expect(403)
      .end(function (doodleSaveErr, doodleSaveRes) {
        // Call the assertion callback
        done(doodleSaveErr);
      });
  });

  it('should not be able to save an Doodle if no name is provided', function (done) {
    // Invalidate name field
    doodle.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doodle
        agent.post('/api/doodles')
          .send(doodle)
          .expect(400)
          .end(function (doodleSaveErr, doodleSaveRes) {
            // Set message assertion
            (doodleSaveRes.body.message).should.match('Please fill Doodle name');

            // Handle Doodle save error
            done(doodleSaveErr);
          });
      });
  });

  it('should be able to update an Doodle if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doodle
        agent.post('/api/doodles')
          .send(doodle)
          .expect(200)
          .end(function (doodleSaveErr, doodleSaveRes) {
            // Handle Doodle save error
            if (doodleSaveErr) {
              return done(doodleSaveErr);
            }

            // Update Doodle name
            doodle.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Doodle
            agent.put('/api/doodles/' + doodleSaveRes.body._id)
              .send(doodle)
              .expect(200)
              .end(function (doodleUpdateErr, doodleUpdateRes) {
                // Handle Doodle update error
                if (doodleUpdateErr) {
                  return done(doodleUpdateErr);
                }

                // Set assertions
                (doodleUpdateRes.body._id).should.equal(doodleSaveRes.body._id);
                (doodleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Doodles if not signed in', function (done) {
    // Create new Doodle model instance
    var doodleObj = new Doodle(doodle);

    // Save the doodle
    doodleObj.save(function () {
      // Request Doodles
      request(app).get('/api/doodles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Doodle if not signed in', function (done) {
    // Create new Doodle model instance
    var doodleObj = new Doodle(doodle);

    // Save the Doodle
    doodleObj.save(function () {
      request(app).get('/api/doodles/' + doodleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', doodle.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Doodle with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/doodles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Doodle is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Doodle which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Doodle
    request(app).get('/api/doodles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Doodle with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Doodle if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doodle
        agent.post('/api/doodles')
          .send(doodle)
          .expect(200)
          .end(function (doodleSaveErr, doodleSaveRes) {
            // Handle Doodle save error
            if (doodleSaveErr) {
              return done(doodleSaveErr);
            }

            // Delete an existing Doodle
            agent.delete('/api/doodles/' + doodleSaveRes.body._id)
              .send(doodle)
              .expect(200)
              .end(function (doodleDeleteErr, doodleDeleteRes) {
                // Handle doodle error error
                if (doodleDeleteErr) {
                  return done(doodleDeleteErr);
                }

                // Set assertions
                (doodleDeleteRes.body._id).should.equal(doodleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Doodle if not signed in', function (done) {
    // Set Doodle user
    doodle.user = user;

    // Create new Doodle model instance
    var doodleObj = new Doodle(doodle);

    // Save the Doodle
    doodleObj.save(function () {
      // Try deleting Doodle
      request(app).delete('/api/doodles/' + doodleObj._id)
        .expect(403)
        .end(function (doodleDeleteErr, doodleDeleteRes) {
          // Set message assertion
          (doodleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Doodle error error
          done(doodleDeleteErr);
        });

    });
  });

  it('should be able to get a single Doodle that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Doodle
          agent.post('/api/doodles')
            .send(doodle)
            .expect(200)
            .end(function (doodleSaveErr, doodleSaveRes) {
              // Handle Doodle save error
              if (doodleSaveErr) {
                return done(doodleSaveErr);
              }

              // Set assertions on new Doodle
              (doodleSaveRes.body.name).should.equal(doodle.name);
              should.exist(doodleSaveRes.body.user);
              should.equal(doodleSaveRes.body.user._id, orphanId);

              // force the Doodle to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Doodle
                    agent.get('/api/doodles/' + doodleSaveRes.body._id)
                      .expect(200)
                      .end(function (doodleInfoErr, doodleInfoRes) {
                        // Handle Doodle error
                        if (doodleInfoErr) {
                          return done(doodleInfoErr);
                        }

                        // Set assertions
                        (doodleInfoRes.body._id).should.equal(doodleSaveRes.body._id);
                        (doodleInfoRes.body.name).should.equal(doodle.name);
                        should.equal(doodleInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Doodle.remove().exec(done);
    });
  });
});
