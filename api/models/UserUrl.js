module.exports = {
  connection: 'photonDb',
  migrate: 'safe',
  tableName: 'user_url',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    code: {
      columnName: 'code',
      type: 'string',
      size: 64,
    },
    platformSmsId: {
      columnName: 'platform_sms_id',
      type: 'integer',
      size: 11,
    },
    // TODO add keys facebook, kik, mobile and referral_count
  },
};
