module.exports = {
  connection: 'photonDb',
  migrate: 'safe',
  tableName: 'users',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  // Only specifying properties that can be used by and exposed to client apps
  attributes: {

    firstName: {
      columnName: 'first_name',
      type: 'string',
      size: 64
    },

    phoneNumber: {
      columnName: 'phone_number',
      type: 'string',
      size: 11
    },

    referralCode: {
      columnName: 'referral_code',
      type: 'string',
      size: 11
    },

    referredBy: {
      columnName: 'referred_by',
      type: 'string',
      size: 11
    }

  }
};