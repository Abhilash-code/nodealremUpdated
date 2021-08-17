const multer = require("multer");
const fs = require('fs')

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error(
      "Invalid mime type, Only *jpeg *jpg & *png are allowed"
    );
    if (isValid) {
      error = null;
    }
     cb(error, "./public/nodelSignature");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
      const type = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + type);
  }
  });

  var uploadFile = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 20,
    },
  });

module.exports =  {
  uploadFile
};
