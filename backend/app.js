var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser=require('body-parser')
var logger = require('morgan');
var usersRouter = require('./routes/users');
const CORS=require('cors')


require('dotenv').config();

require('./config/dbconfig')

var app = express();


// view engine setupdd
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(CORS({origin:['http://localhost:5173'], // Update with your client's origin
// methods: ["GET", "POST", "PUT", "DELETE"],
// credentials: true // Allow credentials (cookies, etc.)
// }));

app.use(CORS())

app.use('/files', express.static('uploads'));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

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
