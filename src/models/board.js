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
  return Board; 
};
