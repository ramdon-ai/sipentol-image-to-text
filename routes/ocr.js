var express = require("express");
var router = express.Router();
var authRouter = require('../routes/auth');

var multer = require('multer');
var { createWorker } = require('tesseract.js');
var path = require("path");

var worker = createWorker({
  logger: m => console.log(m),
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.get("/", authRouter.isLogin, (req, res) => {
  var dataArray = req.session.dataArray || [];
  res.render("admin/ocr", {
    dataArray: dataArray,
    tittle: "ocr",
    username: req.session.username
  });
});

router.post("/upload", upload.single('file'), async (req, res) => {
  var data = path.join(__dirname, "../uploads/" + req.file.filename);
  try {
    await worker.load();
    await worker.loadLanguage('ind');
    await worker.initialize('ind');

    const { data: { text } } = await worker.recognize(data);

    await worker.terminate();

    var resultText = text;
    var dataArray = resultText.split("\n");
    console.log(dataArray);
    req.session.dataArray = dataArray;

    // res.json({ dataArray });
    res.redirect("/scanocr");
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memproses gambar');
  }
});

module.exports = router;