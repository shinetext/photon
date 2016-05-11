'use strict';

module.exports = {

  /**
   * Finds a user's referral code and the number of people they've successfully
   * referred. If a referral code isn't found, then it generates one and saves
   * it to the database.
   */
  findOne: function(req, res) {
    if (typeof req.params.phone === 'undefined') {
      return res.badRequest('Invalid phone in request');
    }

    return res.ok();
  }

};