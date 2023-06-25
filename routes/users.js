var express = require("express");
var router = express.Router();
var connection = require('../config/database');
var authRouter = require('../routes/auth');

router.get("/", authRouter.isLogin, (req, res) => {
  connection.query('SELECT * FROM admin ORDER BY id_admin desc', function (err, rows) {
    if (err) {
        req.flash('error', err);
        res.render('users', {
            data: ''
        });
    } else {
        //render ke view posts index
        res.render('admin/users', {
            tittle: "users",
            data: rows, // <-- data posts
            username: req.session.username
        });
    }
  });
});

module.exports = router;