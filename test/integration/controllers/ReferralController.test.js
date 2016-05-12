var assert = require('assert');
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
    it('should respond with the user');
  });

  describe('#findOne() on user without a referral code', function() {
    it('should respond with the user and add a referral code');
  });

});