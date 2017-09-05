"use strict";

module.exports = {
  /**
   * Finds a user's referral code and the number of people they've successfully
   * referred. If a referral code isn't found, then it generates one and saves
   * it to the database.
   */
  findOne: function(req, res) {
    let phone = PhoneUtils.transformForDb(req.params.phone);

    let resBody = {
      phone: phone,
      referralCode: "",
      referralCount: 0
    };

    // Find this user by the phone number
    User.findOne({ phone: phone })
      .then(function(result) {
        // Throw an error if the user's not found
        if (typeof result === "undefined") {
          throw new Error();
        }

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
        return User.count({
          referredBy: phone,
          mobilecommonsStatus: { "!": ["Profiles with no Subscriptions"] }
        });
        // Note: In actual use, the above also seems to take care of cases where
        // mobilecommonsStatus is undefined. But it doesn't in unit tests.
      })
      // Add the count to the response and send
      .then(function(result) {
        resBody.referralCount = result;

        return res.json(resBody);
      })
      // In case of error, respond with something
      .catch(function(error) {
        return res.json(404, {
          phone: phone,
          error: "Unable to retrieve referral information for this user"
        });
      });
  },
  /**
   * Find a user using custom url params
   * Get alpha/referrer's information using foreign key in custom_url_table
   * The foreign key in the custom_url_table is the id unique to the referrer
   * platform. ie. sms,fb, mobile app
   */
  findCustomUrl: function(req, res) {
    let customUrl = req.params.customUrl;
    let resBody = { customUrl: req.params.customUrl, referralCount: 0 };
    UserReferralCodesTwo.findOne({ code: customUrl })
      .then(function(result) {
        if (typeof result === "undefined") {
          throw new Error();
        }
        // Find SMS subscribed users
        if (result.platformSmsId) {
          User.findOne({ id: result.platformSmsId })
            .then(function(result) {
              if (typeof result === "undefined") {
                throw new Error();
              }
              Object.assign(resBody, result);
              return User.count({
                referredBy: result.phone
              });
            })
            .then(function(referralCount) {
              Object.assign(resBody, { referralCount: referralCount });
              return res.json(resBody);
            })
            .catch(function(error) {
              return res.json(404, {
                error: "Unable to retrieve referral information for this user"
              });
            });
        } else if (result.platformFbId) {
          // Find facebook users
          UserFb.findOne({ id: result.platformFbId })
            .then(function(result) {
              Object.assign(resBody, result);
              return UserFb.count({ referredBy: customUrl });
            })
            .then(function(referralCount) {
              Object.assign(resBody, { referralCount: referralCount });
              return res.json(resBody);
            })
            .catch(function(error) {
              return res.json(404, {
                error:
                  "Unable to retrieve information on the facebook user linked to this url"
              });
            });
        } else {
          //TODO Handle users from FB/KIK/MOBILE_APP
          throw new Error();
        }
      })
      .catch(function(error) {
        return res.json(404, {
          error: "Unable to find a user associated with this url"
        });
      });
  }
};
