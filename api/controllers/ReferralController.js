"use strict";

let Promise = require("bluebird");

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
    return Promise.coroutine(function*() {
      let customUrl = req.params.customUrl;
      let resBody = { customUrl: req.params.customUrl, referralCount: 0 };
      let user = yield UserReferralCodesTwo.findOne({ code: customUrl });
      try {
        let smsUser;
        let fbUser;
        if (typeof user === "undefined") {
          throw new Error();
        }
        if (user.platformSmsId) {
          smsUser = yield User.findOne({ id: user.platformSmsId });
          Object.assign(resBody, smsUser);
        } else if (user.platformFbId) {
          fbUser = yield UserFb.findOne({ id: user.platformFbId });
          Object.assign(resBody, smsUser);
        } else {
          //TODO Handle users from KIK/MOBILE_APP
          throw new Error();
        }
        return res.json(resBody);
      } catch (error) {
        sails.log.error(error, "Error. Can't find a user associated with url");
        return res.status(404).send("Bad Request");
      }
    })();
  }
};
