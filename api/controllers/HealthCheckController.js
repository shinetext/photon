'use strict';

module.exports = {

  /**
   * Conducts a health check.
   *
   * Eventually as more services are created, we should have separate health
   * checks for each service.
   */
  check: function(req, res) {
    // Run a basic query to check database connection
    User.find()
      .limit(1)
      .then(function(result) {
        return res.json(200, {user_db: 'ok'});
      })
      .catch(function(error) {
        return res.json(500, {user_db: 'not ok'});
      });
  },

};