var express = require("express");
var router = express.Router();
var session = require('express-session');
var connection = require('../config/database');

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

router.use(session({ 
  resave: false,
  saveUninitialized: false,
  name: 'secret',
  secret: 'kepo',
  cookie: {
    sameSite: true,
    maxAge: 3600000,
  },
}));

router.get("/", (req, res) => {
    if (req.session.loggedin && req.session.role === "surveyor") {
      connection.query('SELECT * FROM tanah ORDER BY id_tanah desc', function (err, dataTanah) {
        if (err) {
          return console.log("error: " + err.message);
        }
        res.render("surveyor/dashboard", {
        tittle: "Dashboard",
        tanah: dataTanah,
        username: req.session.username
        });
      });
    } else {
        res.redirect("/login");
    }
  });

  router.get("/scanocr", (req, res) => {
    if (req.session.loggedin && req.session.role === "surveyor") {
    var dataArray = req.session.dataArray || [];
    var nop = '';
    var lt = '';
    var lb = '';
    var znt = '';
    var alamatObjekPajak = '';
    var namaSubjekPajak = '';
    var alamatWajibPajak = '';
    var jenisTransaksi = '';
    var status = '';
    var pekerjaan = '';
    var keturunan = '';
    var luasTanah = '';
    var jenisTanah = '';
    var keterangan = '';
    var tindakan = '';
    var pindahBlok = '';
  
    // Mencari nilai yang diinginkan dari dataArray
    for (let i = 0; i < dataArray.length; i++) {
      var line = dataArray[i];
      if (line.includes('NOP ')) {
        console.log(line.replace('NOP', '').trim())
        nop = line.replace('NOP ', '').trim();
      } else if (line.includes('LT')) {
        lt = line.replace('LT:', '').trim();
      } else if (line.includes('LB')) {
        lb = line.replace('LB:', '').trim();
      } else if (line.includes('ZNT')) {
        znt = line.replace('ZNT:', '').trim();
      } else if (line.includes('Alamat Objek Pajak')) {
        alamatObjekPajak = line.replace('Alamat Objek Pajak :', '').trim();
      } else if (line.includes('Nama Subjek Pajak')) {
        console.log(line.replace('Nama Subjek Pajak :', '').trim())
        namaSubjekPajak = line.replace('Nama Subjek Pajak :', '').trim();
      } else if (line.includes('Alamat Wajib Pajak')) {
        alamatWajibPajak = line.replace('Alamat Wajib Pajak :', '').trim();
      } else if (line.includes('Jenis Transaksi :')) {
        jenisTransaksi = line.replace('Jenis Transaksi :', '').trim();
      } else if (line.includes('Status :')) {
        status = line.replace('Status :', '').trim();
      } else if (line.includes('Pekerjaan :')) {
        pekerjaan = line.replace('Pekerjaan :', '').trim();
      } else if (line.includes('Keturahan')) {
        keturunan = line.replace('Keturahan', '').trim();
      } else if (line.includes('Luas Tanah Baru')) {
        luasTanah = line.replace('Luas Tanah Baru =', '').trim();
      } else if (line.includes('Jenis Tanah :')) {
        jenisTanah = line.replace('Jenis Tanah :', '').trim();
      } else if (line.includes('Keterangan:')) {
        keterangan = line.replace('(] Data Tetap () GantiNama () Pecah & Rubah LT (]Rubah LB () Hapus () Gabung () Lainnya : (] Pindah Ke Blok....', '').trim();
      } else if (line.includes('Hapus () Gabung () Lainnya :')) {
        tindakan = line.replace('(] Hapus () Gabung () Lainnya :', '').trim();
      } else if (line.includes('Pindah Ke Blok')) {
        pindahBlok = line.replace('(] Pindah Ke Blok', '').trim();
      }
  
      if (
        nop !== '' &&
        lt !== '' &&
        lb !== '' &&
        znt !== '' &&
        alamatObjekPajak !== '' &&
        namaSubjekPajak !== '' &&
        alamatWajibPajak !== '' &&
        jenisTransaksi !== '' &&
        status !== '' &&
        pekerjaan !== '' &&
        keturunan !== '' &&
        luasTanah !== '' &&
        jenisTanah !== '' &&
        keterangan !== '' &&
        tindakan !== '' &&
        pindahBlok !== ''
      ) {
        break; // Jika semua nilai telah ditemukan, keluar dari loop
      }
    }
} else {
    res.redirect("/login");
}
  console.log(namaSubjekPajak)
    res.render("surveyor/ocr", {
      nop: nop,
      lt: lt,
      lb: lb,
      znt: znt,
      alamatObjekPajak: alamatObjekPajak,
      namaSubjekPajak: namaSubjekPajak,
      alamatWajibPajak: alamatWajibPajak,
      jenisTransaksi: jenisTransaksi,
      status: status,
      pekerjaan: pekerjaan,
      keturunan: keturunan,
      luasTanah: luasTanah,
      jenisTanah: jenisTanah,
      keterangan: keterangan,
      tindakan: tindakan,
      pindahBlok: pindahBlok,
      tittle: "Ocr",
      username: req.session.username
    });
  });

  router.post("/upload", upload.single('file'), async (req, res) => {
    if (req.session.loggedin) {
    var data = path.join(__dirname, "../uploads/" + req.file.filename);
    try {
      await worker.load();
      await worker.loadLanguage('ind');
      await worker.initialize('ind');
  
      var { data: { text } } = await worker.recognize(data);
  
      await worker.terminate();
  
      var resultText = text.trim();
      var dataArray = resultText.split("\n");
      console.log(dataArray);

      req.session.dataArray = dataArray;
      
      res.redirect("/surveyor/scanocr");
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat memproses gambar: ' + error.message);
    }
} else {
    res.redirect("/login");
}
  });
  
  router.get("/datatanah", (req, res) => {
    if (req.session.loggedin && req.session.role === "surveyor") {
      connection.query('SELECT * FROM tanah ORDER BY id_tanah desc', function (err, dataTanah) {
        if (err) {
          return console.log("error: " + err.message);
        }
    res.render("admin/tanah", {
      tittle: "Data Tanah",
              tanah: dataTanah,
      username: req.session.username
    });
  });
} else {
    res.redirect("/login");
}
  });

  router.post("/save", function (req, res) {
    if (req.session.loggedin) {
      let nop = req.body.nop;
      let lt = req.body.lt;
      let lb = req.body.lb;
      let znt = req.body.znt;
      let aop = req.body.alamatobjekpajak;
      let nsp = req.body.namasubjekpajak;
      let awp = req.body.alamatwajibpajak;
  
      if (nop && lt && lb && znt && aop && nsp && awp) {
        connection.query(
          "INSERT INTO tanah (nop, lt, lb, znt, alamatobjekpajak, namasubjekpajak, alamatwajibpajak) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [nop, lt, lb, znt, aop, nsp, awp],
          function (error, results) {
            if (error) throw error;
            res.redirect('/surveyor/datatanah');
          }
        );
      } else {
        res.status(400).send("Data tidak lengkap");
      }
    } else {
      res.redirect("/login");
    }
  });
  
  
    

  router.get("/logout", (req, res) => {
    try {
      req.session.destroy((error) => {
        if (error) {
          console.log(error.message);
        } else {
          res.redirect("/login");
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  });

module.exports = router;