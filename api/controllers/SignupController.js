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

    if (
      typeof firstName === 'undefined' ||
      phone === null ||
      phone.length !== 11
    ) {
      return res.json(400, 'Invalid first name and/or phone number');
    }

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
    User.findOne({ phone: phone })
      .then(function(result) {
        let user = {
          firstName: firstName,
          phone: phone,
        };

        if (email) {
          user.email = email;
        }

        // The referredBy value can be updated if it has not yet been set, or if
        // the user has not yet subscribed to Mobile Commons.
        const canUpdateReferredBy =
          !result ||
          !result.referredBy ||
          (!result.mobilecommonsStatus ||
            result.mobilecommonsStatus !== 'Profiles with no Subscriptions');
        if (referredBy && canUpdateReferredBy) {
          user.referredBy = referredBy;
        }

        // Generate referral code for new user or an existing one that doesn't
        // yet have one set.
        if (!result || !result.referralCode) {
          user.referralCode = ReferralCodes.encode(phone);
        }

        if (result) {
          return User.update({ phone: phone }, user);
        } else {
          return User.create(user);
        }
      })
      .then(function(result) {
        if (!result) {
          throw new Error();
        }

        // Result from an update is an array
        if (result.length > 0) {
          return res.json(result[0]);
        } else {
          // Result from a create is the user object
          return res.json(result);
        }
      })
      .catch(function(error) {
        sails.log.error(error);
        return res.json(500, {
          error: 'There was an error in processing the signup',
        });
      });
  },
};
