module.exports = (sequelize, Sequelize) => {

  const reportSignatures = {
    examDate: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    district: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    session: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      // //allowNull: false,
    },
    centerCode: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    HSSC_Rep_Sign: {
      type: Sequelize.STRING,
    },
    HSSC_Rep_Photo: {
      type: Sequelize.STRING
    },
    center_Invig_Sign: {
      type: Sequelize.STRING,
      //allowNull: false,
    },

    CSR_Photo: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    CSR_Sign: {
      type: Sequelize.STRING,
      //allowNull: false,
    },
    flying_Sqd_Sign: {
      type: Sequelize.STRING,
      // //allowNull: false,
    },

  };

return sequelize.define("ReportSign",reportSignatures);



};
