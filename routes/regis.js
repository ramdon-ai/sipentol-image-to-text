var express = require('express');
var router = express.Router();
var connection = require('../config/database');

router.get('/', function (req, res, next) {
    res.render('register', {
        tittle: "register",
    });
});

router.post("/save", function (req, res) {
    // Tampung inputan user kedalam varibel username, email dan password
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    // Pastikan semua varibel terisi
    if (username && email && password) {
        // Panggil koneksi dan eksekusi query
        connection.query("INSERT INTO admin (username, email, password) VALUES (?, ?, SHA2(?, 512));", [username, email, password], function (error, results) {
            if (error) throw error;
            // Jika tidak ada error
            // Kembali kehalaman login
            res.redirect('/login');
        })
    } else {
        // Kondisi apabila variabel username, email dan password tidak terisi
        res.redirect('/');
        res.end();
    }
});

module.exports = router;