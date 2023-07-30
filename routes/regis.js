var express = require('express');
var router = express.Router();
var connection = require('../config/database');
var bcrypt = require('bcrypt');
var flash  = require('express-flash');

router.get('/', function (req, res, next) {
    res.render('register', {
        tittle: "Register",
    });
});

router.post("/save", function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;

      connection.query("SELECT * FROM users WHERE username=?", [username], function (error, usernameResult) {
        if (error) throw error;
        if (usernameResult.length > 0) {
          req.flash('error', 'Username sudah terdaftar');
          return res.redirect('/');
        }
        connection.query("SELECT * FROM users WHERE email=?", [email], function (error, emailResult) {
          if (error) throw error;
          if (emailResult.length > 0) {
            req.flash('error', 'Email sudah terdaftar');
            return res.redirect('/');
          }
          bcrypt.hash(password, 10, function (err, hashedPassword) {
            if (err) throw err;
            connection.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?);", [username, email, hashedPassword, role], function (error, results) {
              if (error) throw error;
              req.flash('success', 'Registrasi berhasil, silahkan login')
              return res.redirect('/');
            });
          });
        
      });
  });
});
  
module.exports = router;