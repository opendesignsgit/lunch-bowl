module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // ... other fields
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return User;
};
