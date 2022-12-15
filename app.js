var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import multer from 'multer'
const storage = multer.diskStorage({
  // destination:'public/uploads/'+new Date().getFullYear() + (new Date().getMonth()+1) + new Date().getDate(),
  destination(req,res,cb){
    cb(null, __dirname + '/uploads/')
  },
  filename(req,file,cb){
    const filenameArr = file.originalname.split('.')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix+ '.' + filenameArr[filenameArr.length-1])
  }
});

const upload = multer({storage})
import cors from './plugin/cors'
import './plugin/mongodb'
var indexRouter = require('./routes/index');
const v1 = require('./routes/v1/index')
import { initializeSocketIO } from './plugin/socketIO'
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors)
app.socket = initializeSocketIO;

app.post('/file-upload', upload.single('file'), (req, res) => {
  res.send(req.file)
})
app.use('/', indexRouter);
app.use('/v1', v1)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
