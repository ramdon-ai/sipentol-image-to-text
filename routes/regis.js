var express = require('express');
var router = express.Router();
var connection = require('../config/database');
var bcrypt = require('bcrypt');

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
  
    if (username && email && password) {
      bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err) throw err;
        connection.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?);", [username, email, hashedPassword, role], function (error, results) {
          if (error) throw error;
          res.redirect('/login');
        });
      });
    } else {
      res.redirect('/');
    }
  });
  
module.exports = router;