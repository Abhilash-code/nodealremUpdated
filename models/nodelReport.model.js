module.exports = (sequelize, Sequelize) => {

  const nodelFormDetails = {
    examDate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cat_No: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    examName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    signNodelOfficer: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    signHssc_Rep: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    remuneration_pdf: {
      type: Sequelize.STRING,
      // allowNull: false,
    },

  };

return sequelize.define("nodelRenumeration",nodelFormDetails);
};
