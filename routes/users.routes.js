const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../middlewares/request-validation");
const authorize = require("../middlewares/auth");
const csruser = require("../controllers/csrUsers.controller");

const { idUpload } = require("../middlewares/fileUploads");
const nodemailer = require("nodemailer");
// const which = require('which');
// const spawn = require('child_process').spawn;
// // Find npm in PATH
// const npm = which.sync('npm');
// // Execute
// const noErrorSpawn = spawn(npm, ['install']);
// const fs = require("fs");

const smtpTransport = nodemailer.createTransport({
  // service: "Gmail",
  name: 'mail.csr-portal.in',
  host: 'mail.csr-portal.in',
  port: 465,
  secure: true,
  auth: {
    user: "support@csr-portal.in",
    pass: "support@csr-portal",
  },
  // sendmail: true,
  tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
  },
  // logger: true,
  // debug: true
});

// routes
router.post("/login", authenticateSchema, authenticate);
router.post("/register",idUpload, registerSchema, register);
router.post("/districtByDate",  getDistrict);
router.post("/sessionByDate",  getSession);
router.post("/centerByExamDate", getDistrictByExamDate);
router.post("/centerNameByExamDate" ,getcenterNameByCenterCode);
router.post("/examDetails", examDetails)
router.get("/exam-Details", getExamDetails);
router.get("/exam-Details/:district", getCentre);

router.post("/SignaturesBySession", SignaturesBySession);


// router.get("/districts", authorize(), csruser.getDistrict);
router.get("/",  getAll);
router.get("/current", authorize(), getCurrent);
router.get("/:id", authorize(), getById);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);
router.get("/api/getId",  csruser.getUrl);
router.get("/api/getId/:name", csruser.download);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
  csruser
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}


function registerSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    father_name: Joi.string().required(),
    email: Joi.string().required(),
    phone_no: Joi.number().required(),
    examDate: Joi.string().required(),
    district: Joi.string().required(),
    centre_code: Joi.string().required(),
    centerName: Joi.string(),
    address_proof: Joi.string().required(),
    id_no: Joi.string().required(),
    pass: Joi.string(),
    attached_file: Joi.string(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}


async function register(req, res, next) {

  // console.log(req.body)

const newUser = Object({
  name: req.body.name,
  father_name: req.body.father_name,
  email: req.body.email,
  phone_no: req.body.phone_no,
  exam_name: req.body.exam_name,
  examDate: req.body.examDate,
  district: req.body.district,
  centre_code: req.body.centre_code,
  address_proof: req.body.address_proof,
  id_no: req.body.id_no,
  attached_file:process.env.BASE_URL + req.file.filename ,
  username: req.body.username,
  password: req.body.password,
  pass: req.body.password,
  centerName: req.body.centerName,
})
// // console.log(req.body.attached_file + "checking");
  csruser
    .create(newUser)

    .then(() =>{

      const mailOptions = {
        from: "support@csr-portal.in",
        to: req.body.email,
        cc: "admin@csr-portal.in",
        subject: "CSR User Login Credintials",
        html: `
        <p> Hi there, <br> Hope you are doing well! </p>
        <span><b> You have received this mail because you (or admin) have requested to create a new user on CSR User Report Portal</b></span><br><br>
              <span>Please find your Login Credentials!</span><br>

              <p> <b>Username: - </b> ${req.body.username}<br>
              <b>Password: - </b> ${req.body.password} <br></p>

              <p> <b>Thanks & Regards,</b><br> HSSC</p>
          `,
      };

      smtpTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ error: error });
        } else {
          // // console.log(noErrorSpawn);
          res.json({
             Info: "Email sent: " + info.response,
             msg: "Registration successful",
             note:`Your Login Credentials has been sent to your provided email address i.e ${req.body.email}`
         });
        }
      });
      // res.json({ message: "Registration successful " })
      // res.json( {
      //   msg: "Registration successful",
      //   note:`Your Login Credentials has been sent to your provided email address i.e ${req.body.email}`

    // });
    })
    .catch(next);
    // .catch(err =>{
    //   // // console.log(err + "errorrrr");
    //   // fs.unlinkSync(process.env.BASE_URL + req.file.filename);
    //   next;
    // });
}

function getExamDetails (req, res, next) {
  csruser
    .getExamDetails()
    .then((details) => res.json(details))
    .catch(next);
}

function examDetails (req, res, next) {
  csruser
      .examDetails(req.body)
      .then((response) => res.json(response))
      .catch(next);
}

function getDistrictByExamDate(req, res, next) {
  csruser
      .getDistrictByExamDate(req.body)
      .then((examDistrictDetails) => res.json(examDistrictDetails))
      .catch(next);
}

function getcenterNameByCenterCode(req, res, next) {
  csruser
      .getcenterNameByCenterCode(req.body)
      .then((examDistrictDetails) => res.json(examDistrictDetails))
      .catch(next);
}

function SignaturesBySession(req, res, next) {
  csruser
      .SignaturesBySession(req.body)
      .then((Signatures) => res.json(Signatures))
      .catch(next);
}

function getDistrict(req, res, next) {
  csruser
    .getDistrict(req.body)
    .then((district) => res.json(district))
    .catch(next);
}

function getSession(req, res, next) {
  csruser
    .getSession(req.body)
    .then((session) => res.json(session))
    .catch(next);
}



function getCentre(req, res, next) {
  csruser
    .getCentre(req.params.district)
    .then((centre) => res.json(centre))
    .catch(next);
}

function getAll(req, res, next) {
  csruser
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function getById(req, res, next) {
  csruser
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(''),
    father_name: Joi.string().empty(''),
    phone_no: Joi.number().empty(''),
    exam_name: Joi.string().empty(''),
    email: Joi.string().empty(''),
    examDate: Joi.string().empty(''),
    district: Joi.string().empty(''),
    centre_code: Joi.number().empty(''),
    address_proof: Joi.string().empty(''),
    id_no: Joi.number().empty(''),
    attached_file: Joi.string().empty(''),
    username: Joi.string().empty(''),
    password: Joi.string().min(6).empty(''),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  csruser
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  csruser
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}




