var assert = require('assert');
var Barrels = require('barrels');
var fixtures = (new Barrels()).data;
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
            error: 'Unable to retrieve referral information for this user'
          },
          done);
    });
  });

  describe('#findOne() on user with a referral code', function() {
    it('should respond with the user', function(done) {
      var user = fixtures.user[0];

      request(sails.hooks.http.app)
        .get('/referral/' + user.phoneNumber)
        .expect(200)
        .expect(function(res) {
          assert.equal(res.body.phone, user.phoneNumber);
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

      var expectedCode = ReferralCodes.encode(user.phoneNumber);

      request(sails.hooks.http.app)
        .get('/referral/' + user.phoneNumber)
        .expect(200)
        .expect(function(res) {
          assert.equal(res.body.phone, user.phoneNumber);
          assert.equal(res.body.referralCode, expectedCode);
          assert.equal(res.body.referralCount, 0);
        })
        .end(done);
    });
  });

});