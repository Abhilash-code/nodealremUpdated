const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const fs = require("fs");

const swig = require("swig");
const pdf = require("html-pdf");
const moment = require("moment");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
var sign_files = null;

const basePath = process.env.BASE_PATH;


var xl = require('excel4node');
const { alignment } = require('excel4node/distribution/lib/types');





const ocReport = (req,res) =>{
  // console.log(req.body)
  swig.invalidateCache();

  if(req.body.certificateOpeningTime != '')
  {
  req.body.certificateOpeningTime = moment(req.body.certificateOpeningTime).format('h:mm A');
  }

  var mail_html = swig.renderFile("./Reports/ocReport-template.html", { data: req.body });
  const dateCheck = moment().format("DD-MM-YYYY-h-mm-ss-a");

  //// console.log(req.body);

  var options = {
    format: "A4",
    border: {
      "top": "0.1in",            // default is 0, units: mm, cm, in, px
      "right": "0.2in",
      "bottom": "0.3in",
      "left": "0.2in"
    },
    paginationOffset: 1
  }


  const pdffilename = {filename: `OpeningCertificate_${req.body.examDate}_${req.body.centerNumber}_${req.body.session}_${dateCheck}.pdf`};

  pdf.create(mail_html, options).toFile(
    `./uploads/reports/ocreport/OpeningCertificate_${req.body.examDate}_${req.body.centerNumber}_${req.body.session}_${dateCheck}.pdf`,
   function (err, result) {
     if(result){


  const pdfDownloadPath = `${basePath}uploads/reports/ocreport/OpeningCertificate_${req.body.examDate}_${req.body.centerNumber}_${req.body.session}_${dateCheck}.pdf`;


      db.csr_formsStat.update({openingCertificate_submitted: 'true',
      openingCertificate_pdf: pdfDownloadPath}, {
        where: { examDate: req.body.examDate, centerName: req.body.centerName, session: req.body.session }
       })
       res.status(201).send(pdffilename);
       //res.download(result.filename);
      }
      if(err){
      res.status(500).send(err);
      }

   });
}

const getOCReportUrl = (req,res) =>{
  let path = __basedir + "/uploads/reports/csreport";

  fs.readdir(path, function(error , file){
      if(error){
          res.status(500).send({
              message: "No Report Found!",
          });
      }

      let fileInfos = [];

      if(file)
      {
          file.forEach((file) =>{
            fileInfos.push({
              name: file,
              url: process.env.REPORT_URL + file
           });
          });
          res.status(200).send(fileInfos);
      }
  });
};


const reportDownload = (req,res) =>{
  const fileName = req.params.name;
  const path = __basedir + "/uploads/reports/csreport/";

  res.download(path + fileName, fileName, (error)=>{
      if(error){
          res.status(500).send({
              message: "Unable to Download the report!" + error,
          });
      }
  });
};

const csrReport = (req,res) =>{


  swig.invalidateCache();

  req.body.examtime = req.body.examtime!= ''? moment(req.body.examtime).format('h:mm A'): req.body.examtime;
  req.body.policeReportingTime = req.body.policeReportingTime != ''? moment(req.body.policeReportingTime).format('h:mm A'): req.body.policeReportingTime;
  req.body.qrTeam_ArivalTime = req.body.qrTeam_ArivalTime!=''? moment(req.body.qrTeam_ArivalTime).format('h:mm A'): req.body.qrTeam_ArivalTime;
  req.body.qrStartTime = req.body.qrStartTime!=''? moment(req.body.qrStartTime).format('h:mm A'): req.body.qrStartTime;
  req.body.bioMetricTeam_ArivalTime = req.body.bioMetricTeam_ArivalTime!=''? moment(req.body.bioMetricTeam_ArivalTime).format('h:mm A'): req.body.bioMetricTeam_ArivalTime;
  req.body.biometricStartTime = req.body.biometricStartTime != ''? moment(req.body.biometricStartTime).format('h:mm A'): req.body.biometricStartTime;



  req.body.VideographyTeam_ArivalTime = req.body.VideographyTeam_ArivalTime !=''? moment(req.body.VideographyTeam_ArivalTime).format('h:mm A'): req.body.VideographyTeam_ArivalTime;
  req.body.VideographyStartTime = req.body.VideographyStartTime !=''? moment(req.body.VideographyStartTime).format('h:mm A'): req.body.VideographyStartTime;
  req.body.friskingTeam_ArivalTime = req.body.friskingTeam_ArivalTime!=''? moment(req.body.friskingTeam_ArivalTime).format('h:mm A'): req.body.friskingTeam_ArivalTime;
  req.body.friskingStartTime = req.body.friskingStartTime !=''? moment(req.body.friskingStartTime).format('h:mm A'): req.body.friskingStartTime;
  req.body.CCTVTeam_ArivalTime = req.body.CCTVTeam_ArivalTime!= ''? moment(req.body.CCTVTeam_ArivalTime).format('h:mm A'): req.body.CCTVTeam_ArivalTime;
  req.body.JammerTeam_ArivalTime = req.body.JammerTeam_ArivalTime!=''? moment(req.body.JammerTeam_ArivalTime).format('h:mm A'): req.body.JammerTeam_ArivalTime;
  req.body.facialTeam_ArivalTime = req.body.facialTeam_ArivalTime != ''? moment(req.body.facialTeam_ArivalTime).format('h:mm A'): req.body.facialTeam_ArivalTime;


  req.body.HSSC_Sign_Date = req.body.HSSC_Sign_Date!=''?  moment(req.body.HSSC_Sign_Date).format('DD-MM-YYYY'): req.body.HSSC_Sign_Date;
  req.body.CS_Sign_Date = req.body.CS_Sign_Date!=''? moment(req.body.CS_Sign_Date).format('DD-MM-YYYY'): req.body.CS_Sign_Date;



  req.body.videography_at_Entry = req.body.videography_at_Entry== true? 'Yes': 'No';
  req.body.videography_at_OpeningOfPaper = req.body.videography_at_OpeningOfPaper== true? 'Yes': 'No';
  req.body.videography_at_ClosingOfPaper = req.body.videography_at_ClosingOfPaper== true? 'Yes': 'No';
  req.body.videography_at_QusPaper_Vehicle = req.body.videography_at_QusPaper_Vehicle== true? 'Yes': 'No';



  req.body.CCTV_at_Entry = req.body.CCTV_at_Entry== true? 'Yes': 'No';
  req.body.CCTV_at_Exit = req.body.CCTV_at_Exit== true? 'Yes': 'No';
  req.body.CCTV_at_eachExamRoom = req.body.CCTV_at_eachExamRoom== true? 'Yes': 'No';
  req.body.CCTV_at_CS_Room = req.body.CCTV_at_CS_Room== true? 'Yes': 'No';


  // console.log(req.body)

  var mail_html = swig.renderFile("./Reports/csReport-template.html", { data: req.body });
  const dateCheck = moment().format("DD-MM-YYYY-h-mm-ss-a");


  var options = {
    format: "A4",
    border: {
      "top": "0.1in",            // default is 0, units: mm, cm, in, px
      "right": "0.2in",
      "bottom": "0.3in",
      "left": "0.2in"
    },
    paginationOffset: 1
  }

  const pdffilename = {
    filename: `CenterSuperintendent_${req.body.examDate}_${req.body.centerNumber}_${req.body.session}_${dateCheck}.pdf`};


    //// console.log(req.body)

    const csrReportData = Object({
      postName: req.body.postName,
      capacity: req.body.capacity,
      advt_No: req.body.advt_No,
      cat_No: req.body.cat_No,
      centerNumber: req.body.centerNumber,
      qr_arrivalTime: req.body.qrTeam_ArivalTime,
      qr_totalCandidatesChecked: req.body.No_of_QR_Checked_Candidates,
      qr_mismatchRollNo: req.body.qr_Missmatch,
      biometric_arrivalTime: req.body.bioMetricTeam_ArivalTime,
      biometric_deviceUsed: req.body.Biometric_Device,
      biometric_totalCandidatesChecked:req.body.No_Biometric_done ,
      videography_arrivalTime: req.body.VideographyTeam_ArivalTime,

      videography_totalCandidatesVideo: req.body.No_of_videographed_candi,
      videography_coveredPoints:
       `1. ${req.body.videography_at_Entry} 2. ${req.body.videography_at_OpeningOfPaper} 3. ${req.body.videography_at_ClosingOfPaper} 4. ${req.body.videography_at_QusPaper_Vehicle}`,
      frisking_arrivalTime: req.body.friskingTeam_ArivalTime,
      frisking_totalCandidatesChecked: req.body.No_candidate_frisked,
      cctv_totalInstalled: req.body.No_of_CCTV_Camera_Installed,
      cctv_dysfunctional:req.body.No_of_NotWorking_Cameras ,
      cctv_location: `1. ${req.body.CCTV_at_Entry} 2. ${req.body.CCTV_at_Exit}
      3. ${req.body.CCTV_at_eachExamRoom} 4. ${req.body.CCTV_at_CS_Room}`,
      jammers_arrivalTime: req.body.JammerTeam_ArivalTime,
      jammers_totalInstalled: req.body.No_of_Jammers_installed,
      sanitization_points:  `1. ${req.body.No_of_sanitizer_at_entry} 2. ${req.body.No_of_sanitizer_keptInRoom} 3. ${req.body.No_ofGloves_Distriputed_to_staff}`,
      remarks: req.body.CommentsORsuggestion
    })


 //   // console.log(csrReportData)

    db.csrReports.create(csrReportData);


  pdf.create(mail_html, options).toFile(
    `./uploads/reports/csreport/CenterSuperintendent_${req.body.examDate}_${req.body.centerNumber}_${req.body.session}_${dateCheck}.pdf`,


    function (err, result) {
     if(result){

  const pdfDownloadPath = `${basePath}uploads/reports/csreport/CenterSuperintendent_${req.body.examDate}_${req.body.centerNumber}_${req.body.session}_${dateCheck}.pdf`;

  // console.log({examDate: req.body.examDate,
  //   centerName: req.body.centerName, session: req.body.session
  //               });

      db.csr_formsStat.update({CenterSup_submitted: 'true',
      CenterSup_pdf: pdfDownloadPath}, {
        where: { examDate: req.body.examDate, centerName: req.body.centerName, session: req.body.session }
       })

     res.status(201).send(pdffilename);
     }
     if(err){
      res.status(500).send(err);
      }

   });
}


const remunerationReport = (req,res) =>{

  swig.invalidateCache();

  console.log(req.body)


    req.body.nodalExamDateAndTime = moment(req.body.nodalExamDateAndTime).format("DD-MM-YYYY h:mm A");

    //req.body.examDate = moment(req.body.nodalExamDateAndTime).format("DD-MM-YYYY h-mm a");


      req.body.renumerationDetails.forEach(
        (element)=>{
          console.log(element)
          element.dutyPerformedDate = moment(element.dutyPerformedDate).format("DD-MM-YYYY");
        }
      )



  var mail_html = swig.renderFile("./Reports/remunerationReport-template.html", { data: req.body });
  const dateCheck = moment().format("DD-MM-YYYY-h-mm-ss-a");



  var options = {
    format: "A4",
    border: {
      "top": "0.1in",            // default is 0, units: mm, cm, in, px
      "right": "0.2in",
      "bottom": "0.3in",
      "left": "0.2in"
    },
    paginationOffset: 1
  }
    const pdffilename = {
      filename: `Remuneration_${req.body.nodalExaminationName}_${dateCheck}.pdf`};

  pdf.create(mail_html, options).toFile(
    `./uploads/reports/remunerationreport/Remuneration_${req.body.nodalExaminationName}_${dateCheck}.pdf`,
   function (err, result) {
     if(result){


  const pdfDownloadPath = `${basePath}uploads/reports/remunerationreport/Remuneration_${req.body.nodalExaminationName}_${dateCheck}.pdf`;

  console.log(req.body)

  db.nodelFormDetails.update({
  remuneration_pdf: pdfDownloadPath}, {
    where: { examDate: req.body.examDate, examName: req.body.examName, cat_No: req.body.cat_No }
   })

     res.status(201).send(pdffilename);
     }
     if(err){
      res.status(500).send(err);
      }

   });
}


const downloadremunerationReport = (req,res) =>{
  const fileName = req.params.fileName;
  let path = __basedir + "uploads/reports/remunerationreport/";

  res.download(path + fileName, fileName, (error)=>{
    if(error){
        res.status(500).send({
            message: "Unable to Download the file!" + error,
        });
    }

});


}


const downloadCSRReport = (req,res) =>{
  const fileName = req.params.fileName;
  let path = __basedir + "uploads/reports/csreport/";
  // console.log(fileName)
  res.download(path + fileName, fileName, (error)=>{
    if(error){
        res.status(500).send({
            message: "Unable to Download the file!" + error,
        });
    }

});


}


const downloadoOCRReport = (req,res) =>{
  const fileName = req.params.fileName;
  let path = __basedir + "uploads/reports/ocreport/";

  res.download(path + fileName, fileName, (error)=>{
    if(error){
        res.status(500).send({
            message: "Unable to Download the file!" + error,
        });
    }

});


}


//  const reportSignatures = (req, res, next) => {
//    this.sign_files = req.body;

//  }



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
  const path = __basedir + "/public/uploads";

  res.download(path + fileName, fileName, (error)=>{
      if(error){
          res.status(500).send({
              message: "Unable to Download the file!" + error,
          });
      }
  });
};

const excelReport = (req, res, next)=>{

  const postName = req.params.postName;
  // console.log(postName);


  getExcelData(postName).then(

    (csrExcelData) =>
    {
      //res.json(csrExcelData)


   // // console.log(csrExcelData);

// Create a new instance of a Workbook class
var wb = new xl.Workbook();

// Add Worksheets to the workbook
var ws = wb.addWorksheet('Sheet 1');


// Create a reusable style
var style = wb.createStyle({
  font: {
    color: '#FF0800',
    size: 12,
  },
  numberFormat: '$#,##0.00; ($#,##0.00); -',
});


ws.row(1).setHeight(40);
ws.row(2).setHeight(40);
ws.row(3).setHeight(30);
ws.row(4).setHeight(30);

ws.column(1).setWidth(16);
ws.column(2).setWidth(16);
ws.column(3).setWidth(16);
ws.column(4).setWidth(25);
ws.column(5).setWidth(30);
ws.column(6).setWidth(16);
ws.column(7).setWidth(16);
ws.column(8).setWidth(25);
ws.column(9).setWidth(16);
ws.column(10).setWidth(30);
ws.column(11).setWidth(16);
ws.column(12).setWidth(16);
ws.column(13).setWidth(25);
ws.column(14).setWidth(25);
ws.column(15).setWidth(25);
ws.column(16).setWidth(16);
ws.column(17).setWidth(16);
ws.column(18).setWidth(25);
ws.column(19).setWidth(20);
ws.column(20).setWidth(16);

ws.cell(1, 1, csrExcelData.length+4, 20).style({
  border: {
    left: {
			style: 'thin',
			color: 'black',
		},
		right: {
			style: 'thin',
			color: 'black',
		},
		top: {
			style: 'thin',
			color: 'black',
		},
		bottom: {
			style: 'thin',
			color: 'black',
		},
		outline: false,
  }
});


//ws.cell(1, 1, 1, 20).style({border: {top: {style: 'thick'}}});
// ws.cell(1, 1, 1, csrExcelData.length+4).style({border: {bottom: {style: 'thick'}}});
// ws.cell(1, 1, 1, csrExcelData.length+4).style({border: {left: {style: 'thick'}}});
// ws.cell(2, 5, 5, 5).style({border: {right: {style: 'thick'}}});

ws.cell(1, 2, 1, 20, true)
.string(`It is submitted that the examination has been conducted smoothly as reported by the concerned Centre Superintendent. The report of the Centre Superintendent \nthe commission, QR Code, Biometric, Videography, CCTV, Frisking, Jammer & Sanitizer of adverse remarks as under:-`).
style({font: {size: 12, bold: true}, alignment: {vertical:  'center'}});

ws.cell(2, 2, 2, 20, true)
.string(`CENTRE SUPERINTENDENT REPORT ${csrExcelData[0].postName}, ADVT. NO. ${csrExcelData[0].advt_No}, CAT NO. ${csrExcelData[0].cat_No}`)
.style({font: {size: 16, bold: true}, alignment: {vertical:  'center'}});

ws.cell(3, 1, 3, 20).style({font: {size: 12, bold: true}, alignment: {horizontal: 'center', vertical:  'center'}});

ws.cell(4, 1, 4, 20).style({font: {size: 12, bold: true}, alignment: {horizontal: 'center', vertical:  'center'}});

ws.cell(3, 1).string('CENTER CODE');
ws.cell(3, 2).string('');
ws.cell(3, 3, 3, 5, true).string('Q.R code Report');
ws.cell(3, 6, 3, 8, true).string('Biometric Report');
ws.cell(3, 9, 3, 11, true).string('Videography / Photography Report');
ws.cell(3, 12, 3, 13, true).string('Frisking');
ws.cell(3, 14, 3, 16, true).string('CCTV Report');
ws.cell(3, 17, 3, 18, true).string('Jammers');
ws.cell(3, 19).string('Sanitizer');
ws.cell(3, 20).string('Remarks');


ws.cell(4, 1).string('');
ws.cell(4, 2).string('Total Capacity');
ws.cell(4, 3).string('Arrival Time');
ws.cell(4, 4).string('No. of Candidates \nChecked');
ws.cell(4, 5).string('Cases of mismatch \nwith Roll No.');
ws.cell(4, 6).string('Arrival Time');
ws.cell(4, 7).string('Device Used');
ws.cell(4, 8).string('No. of Candidates \nChecked');
ws.cell(4, 9).string('Arrival Time');
ws.cell(4, 10).string('No. of Candidates \nVideographed / Photographed');
ws.cell(4, 11).string('Covered points. \n1. Entry \n2. Opening of papers \n3. Closing \n4. Vehicle');
ws.cell(4, 12).string('Arrival Time');
ws.cell(4, 13).string('No. of Candidates \nChecked');
ws.cell(4, 14).string('No. of CCTV \ninstalled');
ws.cell(4, 15).string('Installed but \ndysfunctional');
ws.cell(4, 16).string('Location \n1. Entry \n2. Exit \n3. Each Room \n4. C-Sptd. Room');
ws.cell(4, 17).string('Arrival Time');
ws.cell(4, 18).string('No. of Jammers \nInstalled');
ws.cell(4, 19).string('Sanitization Points \n1. Entry \n2. Each Room \n3. Gloves to Center Staff');
ws.cell(4, 20).string('');



for(i=0; i< csrExcelData.length; i++){

ws.cell(i+5, 1).number(csrExcelData[i].centerNumber);
ws.cell(i+5, 2).number(csrExcelData[i].capacity);
ws.cell(i+5, 3).string(csrExcelData[i].qr_arrivalTime);
ws.cell(i+5, 4).number(csrExcelData[i].qr_totalCandidatesChecked);
ws.cell(i+5, 5).string(csrExcelData[i].qr_mismatchRollNo);
ws.cell(i+5, 6).string(csrExcelData[i].biometric_arrivalTime);
ws.cell(i+5, 7).string(csrExcelData[i].biometric_deviceUsed);
ws.cell(i+5, 8).number(csrExcelData[i].biometric_totalCandidatesChecked);
ws.cell(i+5, 9).string(csrExcelData[i].videography_arrivalTime);
ws.cell(i+5, 10).number(csrExcelData[i].videography_totalCandidatesVideo);
ws.cell(i+5, 11).string(csrExcelData[i].videography_coveredPoints);
ws.cell(i+5, 12).string(csrExcelData[i].frisking_arrivalTime);
ws.cell(i+5, 13).number(csrExcelData[i].frisking_totalCandidatesChecked);
ws.cell(i+5, 14).number(csrExcelData[i].cctv_totalInstalled);
ws.cell(i+5, 15).number(csrExcelData[i].cctv_dysfunctional);
ws.cell(i+5, 16).string(csrExcelData[i].cctv_location);
ws.cell(i+5, 17).string(csrExcelData[i].jammers_arrivalTime);
ws.cell(i+5, 18).number(csrExcelData[i].jammers_totalInstalled);
ws.cell(i+5, 19).string(csrExcelData[i].sanitization_points);
ws.cell(i+5, 20).string(csrExcelData[i].remarks);
}

// // Set value of cell A1 to 100 as a number type styled with paramaters of style
// ws.cell(1, 1)
//   .number(100)
//   .style(style);

// // Set value of cell B1 to 200 as a number type styled with paramaters of style

// ws.cell(1, 2)
//   .number(200)
//   .style(style);

// // Set value of cell C1 to a formula styled with paramaters of style
// ws.cell(1, 3)
//   .formula('A1 + B1')
//   .style(style);

// // Set value of cell A2 to 'string' styled with paramaters of style
// ws.cell(2, 1)
//   .string('string')
//   .style(style);

// // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
// ws.cell(3, 1)
//   .bool(true)
//   .style(style)
//   .style({font: {size: 14}});

wb.write(`${csrExcelData[0].postName}_ADVTNO-${csrExcelData[0].advt_No}_CATNO-${csrExcelData[0].cat_No}-Excel.xlsx`, res);

}
).catch(next);

}


async function getExamDates() {
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });

  const examDates = db.csr_formsStat.findAll({
    attributes: [[Sequelize.literal('DISTINCT `examDate`'), 'examDate'], 'examDate']
  })

  return examDates
}



async function getExcelData(postName) {
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });
  const csrExcelData = db.csrReports.findAll({
    where: {
      postName : postName
    }
  })

  return csrExcelData
}



const excelreportData = (req,res, next) =>{
  const postName = req.query.postName;
  // console.log(postName)

    getExcelData(postName).then(

      (csrExcelData) =>
      {
      // console.log(csrExcelData);
      res.json(csrExcelData)
    }
      ).catch(next);


};





async function getDistricts(examDate) {
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });
  const districts = db.csr_formsStat.findAll({
    attributes: [[Sequelize.literal('DISTINCT `district`'), 'district'], 'district'],
    where: {
      examDate : examDate
    }
  })

  return districts
}


const DistrictByExamDate = (req,res, next) =>{
  const examDate = req.query.examDate;
  // console.log(examDate)

    getDistricts(examDate).then(

      (districts) =>
      {
      // console.log(districts);
      res.json(districts)
    }
      ).catch(next);


};









async function getCenters(dateAndDistrict) {
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });

  const centers = db.csr_formsStat.findAll({
    attributes: [[Sequelize.literal('DISTINCT `centerName`'), 'centerName'], 'centerName'],
    where: {
      examDate: dateAndDistrict.examDate,
      district: dateAndDistrict.district
    }
  })

  return centers
}


const CenterByDateAndDistrict = (req,res, next) =>{
  const dateAndDistrict = req.query;
  // console.log(dateAndDistrict)

    getCenters(dateAndDistrict).then(

      (centers) =>
      {
      // console.log(centers);
      res.json(centers)
    }
      ).catch(next);


};





async function getcsrFormsStatusData(csrStatusParams) {
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });

  const csrFormsStatusData = db.csr_formsStat.findAll({
    where: {
      examDate: csrStatusParams.examDate,
      district: csrStatusParams.district,
      centerName: csrStatusParams.center
    }
  })

  return csrFormsStatusData
}



const csrFormsStatus = (req,res, next) =>{
  const csrStatusParams = req.query;
  // console.log(csrStatusParams)

    getcsrFormsStatusData(csrStatusParams).then(

      (csrFormsStatusData) =>
      {
      // console.log(csrFormsStatusData);
      res.json(csrFormsStatusData)
    }
      ).catch(next);


};





async function getReportsStatusData(reportParams) {
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });

  const reportData = db.csr_formsStat.findAll({
    attributes: ['remuneration_submitted', 'openingCertificate_submitted', 'CenterSup_submitted'],
    where: {
      examDate: reportParams.examDate,
      district: reportParams.district,
      centerName: reportParams.centerName,
      session: reportParams.session
    }
  })

  return reportData
}



const reportsStatus = (req,res, next) =>{
  const reportParams = req.query;
  // console.log(reportParams)

    getReportsStatusData(reportParams).then(

      (reportData) =>
      {
      // console.log(reportData);
      res.json(reportData)
    }
      ).catch(next);


};




const ExamDates = (req,res, next) =>{

    getExamDates().then(

      (examDates) =>
      {
      // console.log(examDates);
      res.json(examDates)
    }
      ).catch(next);


};






async function getSignatures(reportParams) {
  // return await db.examDetails.aggregate('district', 'DISTINCT', { plain: false });

   console.log(reportParams);
  const  {examDate,cat_No, examName } = reportParams;

  const signBySession = db.nodelFormDetails.findAll({
    // attributes: [[Sequelize.literal('DISTINCT `centerName`'), 'centerName'], 'centerName'],

    where: {
      examName: examName,
      cat_No: cat_No,
      examDate: examDate
    }
  })

  return signBySession
}


const SignaturesBySession = (req, res, next) => {
  console.log(req.body);

  getSignatures(req.body).then(

    (examDates) =>
    {
     console.log(examDates);
    res.json(examDates)
  }
    ).catch(next);

}



async function NodalReports() {
  return await db.nodelFormDetails.findAll();
}



async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.nodelFormDetails.findByPk(id);
  if (!user) throw 'Details not found';
  return user;
}




module.exports = {
  ocReport,
  csrReport,
  remunerationReport,
  getUrl,
  download,
  downloadremunerationReport,
  downloadCSRReport,
  downloadoOCRReport,
  excelReport,
  excelreportData,
  ExamDates,
  DistrictByExamDate,
  CenterByDateAndDistrict,
  csrFormsStatus,
  reportsStatus,
  SignaturesBySession,
  NodalReports,
  delete: _delete
  // reportSignatures

};
