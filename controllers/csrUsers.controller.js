const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const fs = require("fs");
const { Op } = require("sequelize");

const Sequelize = require("sequelize");

async function authenticate({ username, password }) {
  const user = await db.csrUsers.scope('withHash').findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash)))
      throw 'Username or password is incorrect';

  // authentication successful
  const token = jwt.sign({ sub: user.id }, process.env.secret, { expiresIn: '1d' });
  return { ...omitHash(user.get()), token, expiresIn: 86400};
}

async function getAll() {
  return await db.csrUsers.findAll();
}

async function getcenterNameByCenterCode({examDate, district, centre_code}){
  // console.log(examDate, district, centre_code);
  const examDetails = await db.examDetails.findAll({
    attributes: [[Sequelize.literal('DISTINCT `centerName`'), 'centerName'],"district", "centerNumber"],
    where: {
      [Op.and]: [
         { examDate : examDate },
         { district : district },
         { centerNumber: centre_code}
      ]
    }
  })
  return examDetails;
}


async function getDistrictByExamDate({examDate, district}) {
  // console.log(examDate, district);
  const examDetails = await db.examDetails.findAll({
    attributes: [[Sequelize.literal('DISTINCT `centerName`'), 'centerName'],"district", "centerNumber"],
    where: {
      [Op.and]: [
         { examDate : examDate },
         { district : district }
      ]
    }
  })
  return examDetails;
}

async function examDetails({examDate, session, centre_code }) {
  // console.log(examDate, session);
  const examDetails = await db.examDetails.findAll({

    where: {
      [Op.and]: [
         { examName : nodalExaminationName },
         { cat_No : nodalCatNo },
         {examDate: nodalExamDateAndTime}

      ]
    }
  })
  return examDetails;
}

async function getExamDetails() {
  return await db.examDetails.findAll();
}

async function getDistrict({examDate}) {
  // console.log(examDate);
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });
  const districtByDate = await db.examDetails.findAll({
    attributes: [[Sequelize.literal('DISTINCT `district`' ),'district' ],],
    where: {
       examDate : examDate
    }
  })
  return districtByDate
}

async function getSession({examDate}) {
  // console.log(examDate);
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });
  const sessionByDate = await db.examDetails.findAll({
    attributes: [[Sequelize.literal('DISTINCT `session`' ),'session' ],],
    where: {
       examDate : examDate
    }
  })
  return sessionByDate
}



async function getCentre(district) {
  // console.log(district);
  return await db.examDetails.findAll({
    attributes: ["centerName", "centerNumber"],
    where: {
      district : district
    }
  })
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.csrUsers.findOne({ where: { username: params.username } })) {
      throw 'Username "' + params.username + '" is already taken';
  }

  // hash password
  if (params.password) {
      params.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  await db.csrUsers.create(params);
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (usernameChanged && await db.csrUsers.findOne({ where: { username: params.username } })) {
      throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
      params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitHash(user.get());
}

async function SignaturesBySession({username , session, examDate}){
  const signBySession = await db.ReportSign.findAll({
    attributes: [[Sequelize.literal('DISTINCT `username`'), 'username'],"session", "examDate",
    "HSSC_Rep_Sign","HSSC_Rep_Photo","center_Invig_Sign", "CSR_Photo", "CSR_Sign", "flying_Sqd_Sign" ],
    where: {
      [Op.and]: [
        { username: username },
        { session: session },
        { examDate: examDate }
      ]
    }
  })
  return signBySession;
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.csrUsers.findByPk(id);
  if (!user) throw 'User not found';
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}

const getUrl = (req,res) =>{
  let path = __basedir + "/public/uploads";

  fs.readdir(path, function(error , file){
      if(error){
          res.status(500).send({
              message: "Unable to get any Attechment!",
          });
      }

      let fileInfos = [];

      if(file)
      {
          file.forEach((file) =>{
            fileInfos.push({
              name: file,
              url: process.env.BASE_URL + file
           });
          });
          res.status(200).send(fileInfos);
      }
  });
};

const download = (req,res) =>{
  const fileName = req.params.name;
  const path = __basedir + "/public/uploads/";

  res.download(path + fileName, fileName, (error)=>{
      if(error){
          res.status(500).send({
              message: "Unable to Download the file!" + error,
          });
      }
  });
};





module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getUrl,
  download,
  getExamDetails,
  getDistrict,
  getCentre,
  getDistrictByExamDate,
  examDetails,
  getSession,
  SignaturesBySession,
  getcenterNameByCenterCode

};
