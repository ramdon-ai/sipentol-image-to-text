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
  var kelurahan = '';
  var luasTanah = '';
  var jenisTanah = '';
  var keterangan = '';
  var tindakan = '';
  var pindahBlok = '';

  // Mencari nilai yang diinginkan dari dataArray
  for (let i = 0; i < dataArray.length; i++) {
    const line = dataArray[i];
    if (line.includes('NOP :')) {
      nop = line.replace('NOP :', '').trim();
    } else if (line.includes('LT')) {
      lt = line.replace('LT:', '').trim();
    } else if (line.includes('LB')) {
      lb = line.replace('LB:', '').trim();
    } else if (line.includes('ZNT')) {
      znt = line.replace('ZNT:', '').trim();
    } else if (line.includes('Alamat Objek Pajak')) {
      alamatObjekPajak = line.replace('Alamat Objek Pajak :', '').trim();
    } else if (line.includes('Nama Subjek Pajak')) {
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
      kelurahan = line.replace('Keturahan', '').trim();
    } else if (line.includes('Luas Tanah Baru')) {
      luasTanah = line.replace('Luas Tanah Baru =', '').trim();
    } else if (line.includes('Jenis Tanah :')) {
      jenisTanah = line.replace('Jenis Tanah :', '').trim();
    } else if (line.includes('Keterangan:')) {
      keterangan = line.replace('Keterangan:', '').trim();
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
      kelurahan !== '' &&
      luasTanah !== '' &&
      jenisTanah !== '' &&
      keterangan !== '' &&
      tindakan !== '' &&
      pindahBlok !== ''
    ) {
      break; // Jika semua nilai telah ditemukan, keluar dari loop
    }
  }

  res.render("admin/ocr", {
    dataArray: dataArray,
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
    kelurahan: kelurahan,
    luasTanah: luasTanah,
    jenisTanah: jenisTanah,
    keterangan: keterangan,
    tindakan: tindakan,
    pindahBlok: pindahBlok,
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

    res.redirect("/scanocr");
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat memproses gambar');
  }
});

module.exports = router;
