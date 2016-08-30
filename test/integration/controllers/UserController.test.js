'use strict';

const assert = require('assert');
const Barrels = require('barrels');
const fixtures = (new Barrels()).data;
const request = require('supertest');

describe('UserController', () => {

  describe('#find() with email query', () => {
    it('should respond with the user', done => {
      const user = fixtures.user[0];

      request(sails.hooks.http.app)
        .get(`/users?referralCode=${user.referralCode}`)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.firstName, user.firstName);
          assert.equal(res.body.referralCode, user.referralCode);
        })
        .end(done);
    });
  });

  describe('#find() with phone query', () => {
    it('should respond with the user', done => {
      const user = fixtures.user[0];

      request(sails.hooks.http.app)
        .get(`/users?referralCode=${user.referralCode}`)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.firstName, user.firstName);
          assert.equal(res.body.referralCode, user.referralCode);
        })
        .end(done);
    });
  });

  describe('#find() with referralCode query', () => {
    it('should respond with the user', done => {
      const user = fixtures.user[0];

      request(sails.hooks.http.app)
        .get(`/users?referralCode=${user.referralCode}`)
        .expect(200)
        .expect(res => {
          assert.equal(res.body.firstName, user.firstName);
          assert.equal(res.body.referralCode, user.referralCode);
        })
        .end(done);
    });
  });

  describe('#find() with no query', () => {
    it('should respond with a 403', done => {
      request(sails.hooks.http.app)
        .get('/users')
        .expect(403)
        .end(done);
    });
  });

});