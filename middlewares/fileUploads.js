const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
  "application/x-pdf": "pdf",
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
   // console.log(req.body);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error(
      "Invalid mime type, Only *pdf *jpeg *jpg & *png are allowed"
    );
    if (isValid) {
      error = null;
    }
    cb(error, "/public/uploads");
  },

  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const type = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + type);
  },
});

var uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const idUpload = uploadFile.single('attached_file');



module.exports =  {
  uploadFile,
  idUpload
};
