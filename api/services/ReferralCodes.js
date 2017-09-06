"use strict";

var Hashids = require("hashids");

var CODE_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var CODE_MIN_LEN = 6;
var CODE_SALT = "#shineon";

var hashids = new Hashids(CODE_SALT, CODE_MIN_LEN, CODE_ALPHABET);

module.exports = {
  /**
   * Convert phone number into a unique string.
   *
   * @param phone String Phone number
   * @return String Encoded referral code
   */
  encode: function(phone) {
    let number;

    // Remove leading '1' for US numbers if it's there
    if (phone.length === 11 && phone[0] === "1") {
      number = phone.slice(1);
    } else if (phone.length === 10) {
      number = phone;
    } else {
      return false;
    }

    return hashids.encode(parseInt(number));
  },

  /**
   * Decodes unique string code into its original phone number
   *
   * @param code String
   * @return String Decoded phone number
   */
  decode: function(code) {
    let number = hashids.decode(code);
    return number.toString();
  }
};
