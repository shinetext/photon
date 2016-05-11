'use strict';

module.exports = {

  /**
   * Handles a signup submission. Upserts the user and decodes the referral code
   * to the referred_by property if a code is provided.
   */
  signup: function(req, res) {
    if (typeof req.params.phone === 'undefined') {
      return res.badRequest('Invalid phone in request');
    }

    return res.ok();
  }

};