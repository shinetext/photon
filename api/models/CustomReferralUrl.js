module.exports = {
  connection: 'photonDb',
  migrate: 'safe',
  tableName: 'custom_referral_url',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    firstName: {
      columnName: 'first_name',
      type: 'string',
      size: 256,
    },
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
    createdAt: {
        columnName: 'created_at',
        type: 'date'
    }
    // TODO add keys facebook, kik, mobile and referral_count
  }
}
