var express = require('express');
var createError = require('http-errors');
var path = require("path");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var bcrypt = require("bcryptjs");
var session = require('express-session');
var flash   = require('express-flash');


var regisRouter = require('./routes/regis');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var surveyorRouter = require('./routes/surveyor');

var app = express();

app.set('/views', path.join(__dirname, 'views'));


app.set('view engine', 'ejs');

app.use(session({ 
  resave: false,
  saveUninitialized: false,
  name: 'secret',
  secret: 'kepo',
  cookie: {
    sameSite: true,
    maxAge: 3600000,
  },
}));

app.use(flash())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public")));

app.use('/', regisRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/surveyor', surveyorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    title: 'Error',
    error: err.message
  });
});

// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});

module.exports = app;