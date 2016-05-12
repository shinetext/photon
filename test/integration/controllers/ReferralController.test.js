var assert = require('assert');

describe('ReferralController', function() {

  describe('#findOne() with an invalid number', function() {
    it('should respond with a 404');
  });

  describe('#findOne() on user with a referral code', function() {
    it('should respond with the user');
  });

  describe('#findOne() on user without a referral code', function() {
    it('should respond with the user and add a referral code');
  });

});