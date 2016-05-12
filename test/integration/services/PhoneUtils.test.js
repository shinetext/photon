var assert = require('assert');

describe('PhoneUtils', function() {

  describe('#transformForDb()', function() {
    it('"(555) 555-0100" -> "15555550100"', function() {
      assert(PhoneUtils.transformForDb("(555) 555-0100"), "15555550100");
    });
  })

});