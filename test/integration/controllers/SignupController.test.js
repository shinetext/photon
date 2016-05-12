var assert = require('assert');

describe('SignupController', function() {

  describe('#signup() new user without a referral code', function() {
    it('should save the user');
  });

  describe('#signup() new user with a referral code', function() {
    it('should save the user and decode the referral code');
  });

  describe('#signup() existing user with different info', function() {
    it('should update the user\'s info');
  });

});