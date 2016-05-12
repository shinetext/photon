var assert = require('assert');

describe('PhoneUtils', function() {

  describe('#transformForDb("(555) 555-0100")', function() {
    it('should return "15555550100"', function() {
      assert.equal(PhoneUtils.transformForDb('(555) 555-0100'), '15555550100');
    });
  });

  describe('#transformForDb(undefined)', function() {
    it('should return null', function() {
      assert.equal(PhoneUtils.transformForDb(undefined), null);
    })
  })

});