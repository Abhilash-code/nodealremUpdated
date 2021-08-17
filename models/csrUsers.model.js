module.exports = (sequelize, Sequelize) => {

  const users = {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pass: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    father_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone_no: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    examDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    district: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    centre_code: {
      type: Sequelize.STRING,  //should be a integer
      allowNull: false,
    },
    centerName: {
      type: Sequelize.STRING,

    },
    address_proof: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    id_no: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    attached_file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  };
  const options = {
    defaultScope: {

        users: { exclude: ['hash'] }
    },
    scopes: {

        withHash: { users: {}, }
    }
};

return sequelize.define("csrUsers",users,options);



};
