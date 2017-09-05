module.exports = {
  connection: "photonDb",
  migrate: "safe",
  tableName: "users_fb",
  autoCreatedAt: false,
  autoUpdatedAt: false,

  // Only specifying properties that can be used by and exposed to client apps
  attributes: {
    id: {
      columnName: "id",
      type: "integer",
      size: 11,
      autoIncrement: true,
      primaryKey: true
    },

    firstName: {
      columnName: "first_name",
      type: "string",
      size: 64
    },

    referredByTwo: {
      columnName: "referred_by_v2",
      type: "string",
      size: 64
    },

  }
};
