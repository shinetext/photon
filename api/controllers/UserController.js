'use strict';

module.exports = {

  /**
   * Find a user's info based on a provided referral code.
   */
  find: (req, res) => {
    let query;
    if (req.query.referralCode) {
      query = {referralCode: req.query.referralCode};
    }
    else if (req.query.email) {
      query = {email: req.query.email};
    }
    else if (req.query.phone) {
      query = {phone: req.query.phone};
    }
    else {
      return res.json(403, {
        error: 'A referral code, email or phone is required',
      });
    }

    User.findOne(query)
      .then((result) => {
        return res.json({
          firstName: result.firstName,
          referralCode: result.referralCode,
        });
      })
      .catch((error) => {
        return res.json(404, {
          referralCode: req.query.referralCode,
          error: 'Unable to find a user with this referral code',
        });
      });
  },

};