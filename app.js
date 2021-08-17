var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const db = require("./models");
const errorHandler = require('./middlewares/error-handler');

global.__basedir = __dirname + "/";

var app = express();
require('rootpath')();


db.sequelize.sync();
// db.sequelize.sync({force: true}).then(()=>{
//     console.log("Dropping and Resynching Database")
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'https://localhost:8100');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader( "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization");

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

// var corsOptions = {
//     origin: process.env.VIEW_URL,

//  };

//  app.use(cors(corsOptions));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      );
      next();
    });


    app.use(function(req,res,next){
      res.header('Access-Control-Allow-Origin', "*");
      next();
    });
//routes
app.use('/', indexRouter);
app.use('/userRoute', usersRouter);
app.use('/pdfReports', require('./routes/pdfFiles.routes'));
app.use('/users', require('./routes/users.routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





//global error handler
app.use(errorHandler);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
