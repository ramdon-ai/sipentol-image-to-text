var express = require('express');
var router = express.Router();
var connection = require('../config/database');

router.get('/', function (req, res) {
    res.render('login', {
        tittle: "login",
    });
});

router.post('/auth', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
        if (email && password) {
            connection.query("SELECT * FROM admin WHERE email = ? AND password = SHA2(?, 512)", [email, password], function (error, results) {
                if (error) throw error;  
                if (results.length > 0) {
                    // Jika data ditemukan
                    req.session.loggedin = true;
                    req.session.userid = results[0].id_admin;
                    req.session.username = results[0].username;
                    res.redirect('/dashboard');
                } else {
                    // Jika data tidak ditemukan
                    res.redirect('/login');
                }
            });
        } else {
            res.redirect('/login');
            res.end();
        }
});

module.exports = router;