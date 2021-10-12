export default (sequelize, DataTypes) => {
  const Permission = sequelize.define("permission", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true
    }
    // Table 생성 시 createdAt, updatedAt이 자동으로 생성
  });
  Permission.associate = function(models) {
    models.Permission.belongsTo(models.User, {
      foreignKey: 'userIdKey'
    });
  };
  return Permission; 
};
