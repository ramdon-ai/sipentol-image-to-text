var express = require('express');
var router = express.Router();
var connection = require('../config/database');
var bcrypt = require('bcrypt');

router.get('/', function (req, res) {
    res.render('login', {
        tittle: "Login",
    });
});

router.post('/login', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;

  connection.query("SELECT * FROM users WHERE email = ?", [email], function (error, results) {
    if (error) throw error;
    if (results.length > 0) {
      var user = results[0];
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          req.session.loggedin = true;
          req.session.userid = user.id_user;
          req.session.username = user.username;
          req.session.role = user.role;

          if (role === "admin") {
            res.redirect('/admin');
          } else {
            res.redirect('/surveyor');
          }
        } else {
          res.redirect('/login');
        }
      });
    } else {
      res.redirect('/login');
    }
  });
});


module.exports = router;