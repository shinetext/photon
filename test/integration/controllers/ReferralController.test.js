var assert = require('assert');
var Barrels = require('barrels');
var fixtures = new Barrels().data;
var request = require('supertest');

describe('ReferralController', function() {
  describe('#findOne() with an invalid number', function() {
    it('should respond with a 404', function(done) {
      request(sails.hooks.http.app).get('/referral/5555550199').expect(
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
    it('should respond with the user', function(done) {
      var user = fixtures.user[0];

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
  });

  describe('#findOne() on user without a referral code', function() {
    it('should respond with the user and add a referral code', function(done) {
      var user = fixtures.user[4];
      assert.equal(user.referralCode, null);

      var expectedCode = ReferralCodes.encode(user.phone);

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
  });

  describe('#findOne() on user who referred a not-yet-subscribed user', function() {
    it('should not count that user towards their referral', function(done) {
      // Two test users have 15555550114 set as their referredBy. But only one
      // is marked as an active subscriber
      request(sails.hooks.http.app)
        .get(`/referral/15555550114`)
        .expect(200)
        .expect(function(res) {
          assert.equal(res.body.referralCount, 1);
        })
        .end(done);
    });
  });
});
