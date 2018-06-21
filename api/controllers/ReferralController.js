'use strict';

module.exports = {
  /**
   * Finds a user's referral code and the number of people they've successfully
   * referred. If a referral code isn't found, then it generates one and saves
   * it to the database.
   */
  findOne: function(req, res) {
    let phone = PhoneUtils.transformForDb(req.params.phone);

    let resBody = {
      id: undefined,
      phone: phone,
      referralCode: '',
      referralCount: 0
    };

    // Find this user by the phone number
    User.findOne({ phone: phone })
      .then(function(result) {
        // Throw an error if the user's not found
        if (typeof result === 'undefined') {
          throw new Error();
        }

        // set user id in response body
        resBody.id = result.id;

        // If there's already a referral code, add to the response. Otherwise,
        // set flag indicating that one will need to be created.
        let createCode = false;
        if (result.referralCode) {
          resBody.referralCode = result.referralCode;
        } else {
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
          return User.update({ phone: phone }, { referralCode: code });
        }
      })
      // Get the number of people the user has successfully referred
      .then(function(results) {
        const query = `SELECT count(*) AS count FROM users
          WHERE (mobilecommons_status != 'Profiles with no Subscriptions' OR mobilecommons_status IS NULL)
          AND referred_by= ?`;

        User.query(query, [phone], (err, result) => {
          if (err) {
            console.error(err);
            throw new Error('error');
          } else {
            // Add the count to the response and send
            resBody.referralCount = result[0].count;
            return res.json(resBody);
          }
        });
      })
      // In case of error, respond with something
      .catch(function(error) {
        return res.json(404, {
          phone: phone,
          error: 'Unable to retrieve referral information for this user'
        });
      });
  }
};
