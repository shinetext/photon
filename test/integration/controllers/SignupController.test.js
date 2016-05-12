var assert = require('assert');
var Barrels = require('barrels');
var fixtures = (new Barrels()).data;
var request = require('supertest');

describe('SignupController', function() {

  var userSignup1 = {
    firstName: 'SignupController.test.A',
    phone: '5555550112',
  };

  var userSignup2 = {
    firstName: 'SignupController.test.B',
    phone: '5555550113',
    referredByCode: 'Opl22M3'
  };

  var userSignupUpdate = {
    firstName: 'SignupController.test.NewName',
    phone: fixtures.user[6].phoneNumber
  };

  var userSignupEmail = {
    firstName: 'SignupController.test.C',
    phone: '5555550114',
    email: 'user.signup@test.com'
  };

  var userSignupNoName = {
    phone: '5555550115'
  };

  var userSignupNoPhone = {
    firstName: 'SignupController.test.D'
  };

  describe('#signup() new user without a referred-by code', function() {
    it('should save the user', function(done) {

      var expectedCode = ReferralCodes.encode(userSignup1.phone);

      function checkDb() {
        var phone = PhoneUtils.transformForDb(userSignup1.phone);
        User.findOne({phoneNumber: phone})
          .then(function(result) {
            assert.equal(result.firstName, userSignup1.firstName);
            assert.equal(result.phoneNumber, '1' + userSignup1.phone);
            assert.equal(result.referralCode, expectedCode);
            done();
          });
      };

      request(sails.hooks.http.app)
        .post('/signup')
        .send(userSignup1)
        .expect(200)
        .expect(function(res) {
          assert(typeof res.body.id !== 'undefined');
          assert.equal(res.body.firstName, userSignup1.firstName);
          assert.equal(res.body.phoneNumber, '1' + userSignup1.phone);
          assert.equal(res.body.referralCode, expectedCode);
        })
        .end(checkDb);

    });
  });

  describe('#signup() new user with a referred-by code', function() {
    it('should save the user and decode the referral code', function(done) {

      var expectedCode = ReferralCodes.encode(userSignup2.phone);
      var expectedReferredBy = fixtures.user[5].phoneNumber;

      function checkDb() {
        var phone = PhoneUtils.transformForDb(userSignup2.phone);
        User.findOne({phoneNumber: phone})
          .then(function(result) {
            assert.equal(result.firstName, userSignup2.firstName);
            assert.equal(result.phoneNumber, '1' + userSignup2.phone);
            assert.equal(result.referralCode, expectedCode);
            assert.equal(result.referredBy, expectedReferredBy);
            done();
          });
      };

      request(sails.hooks.http.app)
        .post('/signup')
        .send(userSignup2)
        .expect(200)
        .expect(function(res) {
          assert(typeof res.body.id !== 'undefined');
          assert.equal(res.body.firstName, userSignup2.firstName);
          assert.equal(res.body.phoneNumber, '1' + userSignup2.phone);
          assert.equal(res.body.referralCode, expectedCode);
          assert.equal(res.body.referredBy, expectedReferredBy);
        })
        .end(checkDb);

    });
  });

  describe('#signup() existing user with different info', function() {
    it('should update the user\'s info', function(done) {

      var expectedCode = ReferralCodes.encode(userSignupUpdate.phone);

      function checkDb() {
        var phone = PhoneUtils.transformForDb(userSignupUpdate.phone);
        User.findOne({phoneNumber: phone})
          .then(function(result) {
            assert.equal(result.firstName, userSignupUpdate.firstName);
            assert.equal(result.phoneNumber, userSignupUpdate.phone);
            assert.equal(result.referralCode, expectedCode);
            done()
          });
      }

      request(sails.hooks.http.app)
        .post('/signup')
        .send(userSignupUpdate)
        .expect(200)
        .expect(function(res) {
          assert(typeof res.body.id !== 'undefined');
          assert.equal(res.body.firstName, userSignupUpdate.firstName);
          assert.equal(res.body.phoneNumber, userSignupUpdate.phone);
          assert.equal(res.body.referralCode, expectedCode);
        })
        .end(checkDb);

    });
  });

  describe('#signup() new user with email', function() {
    it('should save the user with the email', function(done) {

      var expectedCode = ReferralCodes.encode(userSignupEmail.phone);

      function checkDb() {
        var phone = PhoneUtils.transformForDb(userSignupEmail.phone);
        User.findOne({phoneNumber: phone})
          .then(function(result) {
            assert.equal(result.email, userSignupEmail.email);
            assert.equal(result.firstName, userSignupEmail.firstName);
            assert.equal(result.phoneNumber, '1' + userSignupEmail.phone);
            assert.equal(result.referralCode, expectedCode);
            done();
          });
      }

      request(sails.hooks.http.app)
        .post('/signup')
        .send(userSignupEmail)
        .expect(200)
        .expect(function(res) {
          assert(typeof res.body.id !== 'undefined');
          assert.equal(res.body.email, userSignupEmail.email);
          assert.equal(res.body.firstName, userSignupEmail.firstName);
          assert.equal(res.body.phoneNumber, '1' + userSignupEmail.phone);
          assert.equal(res.body.referralCode, expectedCode);
        })
        .end(checkDb);

    });
  })

  describe('#signup() user without a first name', function() {
    it('should respond with a 400', function(done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send(userSignupNoName)
        .expect(400)
        .end(done);
    });
  });

  describe('#signup() user without a phone number', function() {
    it('should respond with a 400', function(done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send(userSignupNoPhone)
        .expect(400)
        .end(done);
    });
  });

  describe('#signup() user with an invalid phone number', function() {
    it('should respond with a 400', function(done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send({phone: '12345678901234567890'})
        .expect(400)
        .end(done);
    });
  });

});