var express = require('express');
var bodyParser = require('body-parser');
var createError = require('http-errors');
var path = require("path");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash   = require('express-flash');


var regisRouter = require('./routes/regis');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var surveyorRouter = require('./routes/surveyor');

var app = express();

app.set('/views', path.join(__dirname, 'views'));


app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({ 
  resave: true,
  saveUninitialized: true,
  name: 'roy',
  secret: 'rahasia',
  cookie: {
    sameSite: false,
    maxAge: 3600000,
  },
}));

app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
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