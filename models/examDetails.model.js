module.exports = (sequelize, Sequelize) => {

  const examDetails = {
    examDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    examName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    district: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    centerName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    centerNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    centerCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    capacity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    postName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    advt_No: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cat_No: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    session: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  };

return sequelize.define("examDetails",examDetails);



};
