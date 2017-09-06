"use strict"

module.exports = {
  /**
   * Generate a unique url using a users name
   */
  generateCustomUrl: function(name) {
    let grammar = "Graceful";
    return `${name}${grammar}`;
  }
};
