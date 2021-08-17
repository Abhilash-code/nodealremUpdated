const express = require("express");
const router = express.Router();
const cors = require('cors');
const { uploadFile } = require("../middlewares/reportSignUpload");
const pdfFiles = require('../controllers/pdfFiles.controller');
const db = require("../models");
const moment = require("moment");


var sign_files = null;

var nodel_Signs = null;

const basePath = process.env.BASE_PATH

// routes

var corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE"
}

router.post("/csrReport", pdfFiles.csrReport);
router.post("/openingCertificateReport",cors(corsOptions), pdfFiles.ocReport);
router.get("/remunerationReportpdf/:fileName", pdfFiles.downloadremunerationReport);
router.get("/csrReportpdf/:fileName", pdfFiles.downloadCSRReport);
router.get("/ocReportpdf/:fileName", pdfFiles.downloadoOCRReport);
router.get("/excelreport/:postName", pdfFiles.excelReport);
router.get("/excelreportData", pdfFiles.excelreportData);
router.get("/ExamDates", pdfFiles.ExamDates);
router.get("/DistrictByExamDate", pdfFiles.DistrictByExamDate);
router.get("/CenterByDateAndDistrict", pdfFiles.CenterByDateAndDistrict);
router.get("/csrFormsStatus", pdfFiles.csrFormsStatus);
router.get("/reportsStatus", pdfFiles.reportsStatus);

router.get("/NodalReports", NodalReports);
router.delete("/deletenodal/:id", _delete);



router.post("/SignaturesBySession" , pdfFiles.SignaturesBySession);




function NodalReports(req, res, next) {
  pdfFiles
    .NodalReports()
    .then((users) => res.json(users))
    .catch(next);
}




function _delete(req, res, next) {
  pdfFiles
    .delete(req.params.id)
    .then(() => res.json({ message: "Detail deleted successfully" }))
    .catch(next);
}


const signUpload = uploadFile.fields([
  {
    name: 'nodalOff_signature' , maxCount: 1
  },
  {
    name: 'hsscRepresentative_signature' , maxCount: 1
  }
]);
router.post("/remunerationReport", cors(corsOptions), signUpload, pdfFiles.remunerationReport);





router.post("/reportSignatures" , signUpload, (req,res,next) => {
 // console.log(req.body)
  //console.log(req.files)
  this.sign_files = req.files;
  const newReportSign ={
    examDate: moment(req.body.examDate).format("DD-MM-YYYY h:mm a"),
    cat_No: req.body.cat_No,
    examName: req.body.examName,
    nodalOff_signature_data: req.files.nodalOff_signature? basePath+req.files.nodalOff_signature[0].path : undefined,
    hsscRepresentative_signature_data: req.files.hsscRepresentative_signature? basePath+req.files.hsscRepresentative_signature[0].path : undefined
}

console.log(newReportSign);

db.nodelFormDetails.create(newReportSign)
.then(() => {
  res.json({
     message: "Signatures Uploads Successfully",
     newReportSign
 });
})
.catch(next);
});

const nodelUploads = uploadFile.fields([
  {
    name: 'nodalOff_signature' , maxCount: 1
  },
  {
    name: 'hsscRepresentative_signature' , maxCount: 1
  },
]);

router.post("/nodelReport", nodelUploads, (req, res, next) => {

  console.log(req.files)
    this.nodel_Signs = req.files;
    const newNodelReport = {
      examDate: moment(req.body.examDate).format("DD-MM-YYYY h:mm a"),
      cat_No: req.body.cat_No,
      examName: req.body.examName,
      signNodelOfficer: req.files.nodalOff_signature? basePath+req.files.nodalOff_signature[0].path: undefined,
      signHssc_Rep: req.files.hsscRepresentative_signature? basePath+req.files.hsscRepresentative_signature[0].path: undefined
    }
    db.nodelFormDetails.create(newNodelReport)
    .then(() => {
      res.json({
        message: "Signature Uploads Successfully",
        newNodelReport
      });
    })
    .catch(next);
})


module.exports = router;
