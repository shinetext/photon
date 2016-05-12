var assert = require('assert');
var Barrels = require('barrels');
var fixtures = (new Barrels()).data;

describe('User', function() {

  var userToCreate = {
    firstName: 'User.text.create',
    phoneNumber: '15555550100',
    referralCode: 'JblJJPj',
    referredBy: '15555550102'
  };

  describe('#create()', function() {
    it('should create and return the user object', function(done) {
      User.create(userToCreate)
        .then(function(result) {
          assert(typeof result.id !== 'undefined');
          assert.equal(result.firstName, userToCreate.firstName);
          assert.equal(result.phoneNumber, userToCreate.phoneNumber);
          assert.equal(result.referralCode, userToCreate.referralCode);
          assert.equal(result.referredBy, userToCreate.referredBy);

          done();
        });
    });
  });

  describe('#findOne() by phone number', function() {
    it('should find the user', function(done) {
      User.findOne({phoneNumber: fixtures.user[0].phoneNumber})
        .then(function(result) {
          assert.equal(result.firstName, fixtures.user[0].firstName);
          assert.equal(result.phoneNumber, fixtures.user[0].phoneNumber);
          assert.equal(result.referralCode, fixtures.user[0].referralCode);
          assert.equal(result.referredBy, fixtures.user[0].referredBy);

          done();
        });
    })
  });

  describe('#update() with a referralCode', function() {
    it('should update the user', function(done) {
      var dummyCode = 'abc0102';
      assert(fixtures.user[3].referralCode != dummyCode);

      User.update({phoneNumber: fixtures.user[3].phoneNumber}, {referralCode: dummyCode})
        .then(function(results) {
          assert(results.length > 0);
          assert.equal(results[0].referralCode, dummyCode);

          return User.findOne({phoneNumber: fixtures.user[3].phoneNumber});
        })
        .then(function(result) {
          assert.equal(result.referralCode, dummyCode);

          done();
        });
    });
  });

  describe('#count() with a referredBy number', function() {
    it('should return a count of users referred by that number', function(done) {
      User.count({referredBy: fixtures.user[0].phoneNumber})
        .then(function(result) {
          assert.equal(result, 2); // UserB and UserC

          done();
        });
    });
  });

});