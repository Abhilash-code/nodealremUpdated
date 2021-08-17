module.exports = (sequelize, Sequelize) => {

  const csrReports = {
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
    centerNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_arrivalTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    qr_totalCandidatesChecked: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_mismatchRollNo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    biometric_arrivalTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    biometric_deviceUsed: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    biometric_totalCandidatesChecked: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    videography_arrivalTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    videography_totalCandidatesVideo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    videography_coveredPoints: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    frisking_arrivalTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    frisking_totalCandidatesChecked: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    cctv_totalInstalled: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    cctv_dysfunctional: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    cctv_location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jammers_arrivalTime: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jammers_totalInstalled: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sanitization_points: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    remarks: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  };

return sequelize.define("csrReports",csrReports);



};
