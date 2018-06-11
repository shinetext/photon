'use strict';

var assert = require('assert');
var Barrels = require('barrels');
var fixtures = new Barrels().data;
var request = require('supertest');

describe('ReferralController', function() {
  describe('#findOne() with an invalid number', function() {
    it('should respond with a 404', function(done) {
      request(sails.hooks.http.app)
        .get('/referral/5555550199')
        .expect(
          404,
          {
            phone: '15555550199',
            error: 'Unable to retrieve referral information for this user',
          },
          done
        );
    });
  });

  describe('#findOne() on user with a referral code', function() {
    let userQueryOriginal;

    before(() => {
      userQueryOriginal = User.query;
    });

    it('should respond with the user', function(done) {
      var user = fixtures.user[0];

      // Note: For some reason, User.query is undefined in the test environment.
      // So we're creating a sort of stub method here to both validate and mock
      // behavior. It does however make these tests slightly less helpful with
      // testing the referral counting logic.
      User.query = function(query, params, callback) {
        assert.equal(typeof query, 'string');
        assert.deepEqual(params, [user.phone]);
        callback(undefined, [{ count: 2 }]);
      };

      request(sails.hooks.http.app)
        .get('/referral/' + user.phone)
        .expect(200)
        .expect(function(res) {
          assert.equal(res.body.phone, user.phone);
          assert.equal(res.body.referralCode, user.referralCode);
          assert.equal(res.body.referralCount, 2); // User.test.B and User.test.C
        })
        .end(done);
    });

    after(() => {
      User.query = userQueryOriginal;
    });
  });

  describe('#findOne() on user without a referral code', function() {
    let userQueryOriginal;

    before(() => {
      userQueryOriginal = User.query;
    });

    it('should respond with the user and add a referral code', function(done) {
      var user = fixtures.user[4];
      var expectedCode = ReferralCodes.encode(user.phone);

      assert.equal(user.referralCode, null);

      // See note on User.query in a previous test above
      User.query = function(query, params, callback) {
        assert.equal(typeof query, 'string');
        assert.deepEqual(params, [user.phone]);
        callback(undefined, [{ count: 0 }]);
      };

      request(sails.hooks.http.app)
        .get('/referral/' + user.phone)
        .expect(200)
        .expect(function(res) {
          assert.equal(res.body.phone, user.phone);
          assert.equal(res.body.referralCode, expectedCode);
          assert.equal(res.body.referralCount, 0);
        })
        .end(done);
    });

    after(() => {
      User.query = userQueryOriginal;
    });
  });

  describe('#findOne() on user who referred a not-yet-subscribed user', function() {
    let userQueryOriginal;

    before(() => {
      userQueryOriginal = User.query;
    });

    it('should not count that user towards their referral', function(done) {
      const phone = '15555550122';

      // See note on User.query in a previous test above
      User.query = function(query, params, callback) {
        assert.equal(typeof query, 'string');
        assert.deepEqual(params, [phone]);
        callback(undefined, [
          {
            count: 1,
          },
        ]);
      };

      // Two test users have 15555550114 set as their referredBy. But only one
      // is marked as an active subscriber
      request(sails.hooks.http.app)
        .get(`/referral/${phone}`)
        .expect(200)
        .expect(function(res) {
          assert.equal(res.body.referralCount, 1);
        })
        .end(done);
    });

    after(() => {
      User.query = userQueryOriginal;
    });
  });
});
