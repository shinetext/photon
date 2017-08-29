module.exports = {
  connection: 'photonDb',
  migrate: 'safe',
  tableName: 'custom_referral_url',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    referralUrl: {
      columnName: 'referral_url',
      type: 'string',
      size: 66
    },
    platformSmsId: {
      columnName: 'platform_sms_id',
      type: 'integer',
      size: 11
    },
    // TODO add keys facebook, kik, mobile and referral_count
  }
}
