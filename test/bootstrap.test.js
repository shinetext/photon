/**
 * @see http://sailsjs.org/documentation/concepts/testing#?bootstraptestjs
 */

var sails = require('sails');
var Barrels = require('barrels');

before(function(done) {
  sails.lift({
    connections: {
      photonDb: {
        adapter: 'sails-memory'
      }
    },
    models: {
      migrate: 'drop'
    }
  }, function(err, server) {
    if (err) return done(err);

    // Load fixtures and populate the db
    var barrels = new Barrels();
    barrels.populate(function(err) {
      done(err, sails);
    });
  });
});

after(function(done) {
  // Here you can clear fixtures, etc.
  sails.lower(done);
});