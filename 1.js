
// // server {
// //         charset utf-8;
// //         listen 80 default_server;
// //         server_name _;

// //         # angular App & frontend files

// //         location / {
// //                 root /usr/frontend;
// //                 try_files $uri /index.html;
// //         }

// //         # node api reverse proxy

// //         location /api {
// //                 proxy_pass http://localhost:3000;
// // }}


// const multer = require('multer')
// const storage = multer.diskStorage({
// destination: (req, file, cb) => {
//   const isValid = MIME_TYPE_MAP[file.mimetype];
//   let error = new Error(
//     "Invalid mime type, Only *jpeg *jpg & *png are allowed"
//   );

//   if (isValid) {
//     error = null;
//   }
//   const { id,session,examDate  } = req.body
//   const folderName = `${id}+${session}+${examDate}`
//   const dir = __basedir + `${folderName}`
//   fs.exists(dir, exist => {
//   if (!exist) {
//     return fs.mkdir(dir, error => cb(error, dir))
//   }
//   return cb(null, dir)
//   })
// },
// filename: (req, file, cb) => {
//   const { userId } = req.body
//   const name = file.originalname.toLowerCase().split(" ").join("-");
//     const type = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + type);
// }
// });

// var uploadFile = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 20,
//   },
// });

// const upload = multer({ storage })
