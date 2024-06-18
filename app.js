var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var bodyParser = require('body-parser')
const flash = require('connect-flash')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const crypto = require('crypto-js');


var app = express();



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.json());


app.use(session({
  secret: 'keyboard',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function hashUrl(url) {
  return crypto.SHA256(url).toString(crypto.enc.Hex);
}

app.use((req, res, next) => {
  // Construct the original URL based on the current request
  res.locals.currentUrl = req.originalUrl;


  // Set the baseUrl in response locals
  const baseUrl = `${req.protocol}://${req.hostname}:${req.app.get('port')}`;
  res.locals.baseUrl = baseUrl;

  // Hash the URL
  const hashedUrl = hashUrl(baseUrl);

  // Set the hashed URL as a property in the request object for future use
  req.hashedUrl = hashedUrl;

  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);



// Middleware to handle 404 errors
app.use(function (req, res, next) {
  res.redirect('/')
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
