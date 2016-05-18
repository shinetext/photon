var request = require('supertest');

describe('HealthCheckController', function() {

  describe('#check()', function() {
    it('should respond with a 200', function(done) {
      request(sails.hooks.http.app)
        .get('/health')
        .expect(200)
        .end(done);
    });
  });

});