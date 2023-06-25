var express = require("express");
var router = express.Router();
var authRouter = require('../routes/auth');

router.get("/", authRouter.isLogin, (req, res) => {
    res.render("admin/dashboard", {
      tittle: "dashboard",
      username: req.session.username
    })
  });

module.exports = router;