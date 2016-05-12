'use strict';

module.exports = {
  /**
   * Transforms the string to conform to what the database should expect.
   *
   * @param phone String phone number to transform
   */
  transformForDb: function(phone) {
    let result = phone;

    // Remove all non-numeric characters
    result = result.replace(/\D+/g, '');

    // Add a leading '1' for the US country code
    if (result.length === 10) {
      result = '1' + result;
    }

    return result;
  }
};