'use strict';

module.exports = {

  /**
   * Finds a user's referral code and the number of people they've successfully
   * referred. If a referral code isn't found, then it generates one and saves
   * it to the database.
   */
  findOne: function(req, res) {
    let user;
    let phone = req.params.phone;

    if (phone.length === 10) {
      phone = '1' + phone;
    }

    let resBody = {
      phone: phone,
      referralCode: '',
      referralCount: 0
    }

    // Find this user by the phone number
    User.findOne({phone_number: phone})
      .then(function(result) {
        // Throw an error if the user's not found
        if (typeof result === 'undefined') {
          throw new Error;
        }

        // If there's already a referral code, add to the response. Otherwise,
        // set flag indicating that one will need to be created.
        let createCode = false;
        if (result.referralCode) {
          resBody.referralCode = result.referralCode;
        }
        else {
          createCode = true;
        }

        return createCode;
      })
      // If needed, create the referral code and update the database
      .then(function(createCode) {
        if (createCode) {
          let code = ReferralCodes.encode(phone);

          // Add to response
          resBody.referralCode = code;

          // Update in the database
          return User.update({phone_number: phone}, {referral_code: code});
        }
      })
      // Get the number of people the user has successfully referred
      .then(function(results) {
        return User.count({referred_by: phone});
      })
      // Add the count to the response and send
      .then(function(result) {
        resBody.referralCount = result;

        return res.json(resBody);
      })
      // In case of error, respond with something
      .catch(function(error) {
        return res.json({
          phone_number: phone,
          error: 'Unable to retrieve referral information for this user'
        });
      });
  }

};