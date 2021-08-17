module.exports = (sequelize, Sequelize) => {

  const csr_formsStat = {
    examDate: {
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
    session: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    remuneration_submitted: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    openingCertificate_submitted: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    CenterSup_submitted: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    remuneration_pdf: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    openingCertificate_pdf: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    CenterSup_pdf: {
      type: Sequelize.STRING,
      allowNull: true,
    }

  };

return sequelize.define("csr_formsStat",csr_formsStat);



};
