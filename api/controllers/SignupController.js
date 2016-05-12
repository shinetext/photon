'use strict';

module.exports = {

  /**
   * Handles a signup submission. Upserts the user and decodes the referral code
   * to the referredBy property if a code is provided.
   */
  signup: function(req, res) {
    // Required
    let firstName = req.body.firstName;
    let phone = PhoneUtils.transformForDb(req.body.phone);

    // Optional
    let email = req.body.email;
    let referredBy;
    let referredByCode = req.body.referredByCode;
    if (referredByCode) {
      let number = ReferralCodes.decode(referredByCode);
      // A valid code will result in a 10-digit number
      if (number.toString().length === 10) {
        referredBy = PhoneUtils.transformForDb(number);
      }
    }

    // Upsert the user with the provided info
    User.findOne({phoneNumber: phone})
      .then(function(result) {
        let user = {
          firstName: firstName,
          phoneNumber: phone
        };

        if (email) {
          user.email = email;
        }

        if (referredBy) {
          user.referredBy = referredBy;
        }

        // Generate referral code for new user or an existing one that doesn't
        // yet have one set.
        if (! result || ! result.referralCode) {
          user.referralCode = ReferralCodes.encode(phone);
        }

        if (result) {
          return User.update({phoneNumber: phone}, user);
        }
        else {
          return User.create(user);
        }
      })
      .then(function(result) {
        if (! result) {
          throw new Error;
        }

        // Result from an update is an array
        if (result.length > 0) {
          return res.json(result[0]);
        }
        // Result from a create is the user object
        else {
          return res.json(result);
        }
      })
      .catch(function(error) {
        console.log(error);
        return res.json({
          error: 'uh oh'
        });
      })
  }

};