var assert = require('assert');

describe('ReferralCodes', function() {
  var testNumber = '3015550101';
  var testCode = 'qGl0G4r';

  describe('#encode('+testNumber+')', function() {
    it('should = ' + testCode, function() {
      assert(ReferralCodes.encode(testNumber), testCode);
    });
  });

  describe('#decode('+testCode+')', function() {
    it('should = ' + testNumber, function() {
      assert(ReferralCodes.decode(testCode), testNumber);
    });
  });

});