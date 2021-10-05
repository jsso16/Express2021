export default (sequelize, DataTypes) => {
  const Board = sequelize.define("board", {
    title: {
      type: sequelize.STRING,
      allowNull: false
    },
    content: {
      type: sequelize.TEXT,
      allowNull: true
    }
  });
  Board.associate = function(models) {
    models.Board.belongsTo(models.User);
  };
  return Board; 
};
