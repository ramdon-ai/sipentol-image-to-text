var express = require("express");
var router = express.Router();
// var session = require('express-session');
var connection = require('../config/database');

var multer = require('multer');
var { createWorker } = require('tesseract.js');
var path = require("path");

var worker = createWorker({
  logger: m => console.log(m),
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });


router.get("/", (req, res) => {
  if (req.session.loggedin && req.session.role === "surveyor") {
    connection.query('SELECT * FROM tanah ORDER BY id_tanah desc', function (err, dataTanah) {
      if (err) {
        return console.log("error: " + err.message);
      }
      connection.query(
        "SELECT tanggal, COUNT(*) AS jumlah_data FROM tanah WHERE tanggal = CURDATE() GROUP BY tanggal",
        (err, dataHari) => {
          if (err) {
            return console.log("error: " + err.message);
          }
          connection.query(
            "SELECT EXTRACT(YEAR_MONTH FROM tanggal) AS tahun_bulan, COUNT(*) AS jumlah_data FROM tanah WHERE YEAR(tanggal) = YEAR(CURDATE()) AND MONTH(tanggal) = MONTH(CURDATE()) GROUP BY tahun_bulan",
            (err, dataBulan) => {
              if (err) {
                return console.log("error: " + err.message);
              }
              connection.query(
                "SELECT EXTRACT(YEAR FROM tanggal) AS tahun, COUNT(*) AS jumlah_data FROM tanah WHERE YEAR(tanggal) = YEAR(CURDATE()) GROUP BY tahun",
                (err, dataTahun) => {
                  if (err) {
                    return console.log("error: " + err.message);
                  }
                  connection.query('SELECT nop, lb, znt, alamat_objek_pajak, nama_subjek_pajak, alamat_wajib_pajak, lt, luas_tanah_baru FROM tanah ORDER BY id_tanah DESC', function (err, dataPerubahan) {
                    if (err) {
                      return console.log("error: " + err.message);
                    }
                    var dataBaru = dataPerubahan.filter(item => item.lt !== item.luas_tanah_baru);
                    var jumlahDataBaru = dataBaru.length;
                    res.render("surveyor/dashboard", {
                      tittle: "Dashboard",
                      tanah: dataTanah,
                      username: req.session.username,
                      hari: dataHari,
                      bulan: dataBulan,
                      tahun: dataTahun,
                      perubahan: dataPerubahan,
                      jumlah: jumlahDataBaru,
                      baru: dataBaru
                    });
                  });
                }
              );
            }
          );
        }
      );
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
      var kelurahan = '';
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
      kelurahan: kelurahan,
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
    var data = path.join(__dirname, "../public/uploads/" + req.file.filename);
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

      let file = req.file.filename;

      connection.query("INSERT INTO tanah (gambar) VALUES (?)", [file], function (error, results) {
        if (error) throw error;
        var idTanah = results.insertId;
        console.log(idTanah);
        req.session.idTanah = idTanah;
      res.redirect("/surveyor/scanocr");
    });
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat memproses gambar: ' + error.message);
    }
} else {
    res.redirect("/login");
}
  });
  

  router.post("/save", function (req, res) {
    if (req.session.loggedin) {
      let nop = req.body.nop || '-';
      let lt = req.body.lt || '-';
      let lb = req.body.lb || '-';
      let znt = req.body.znt || '-';
      let alamatObjekPajak = req.body.alamatObjekPajak || '-';
      let namaSubjekPajak = req.body.namaSubjekPajak || '-';
      let alamatWajibPajak = req.body.alamatWajibPajak || '-';
      let jenisTransaksi = req.body.jenisTransaksi || [];
      let nopInduk = req.body.nopInduk || '-';
      let nopBaru = req.body.nopBaru || '-';
      let namaJalanObjek = req.body.namaJalanObjek || '-';
      let blokKavNoObjek = req.body.blokKavNoObjek || '-';
      let kelurahanObjek = req.body.kelurahanObjek || '-';
      let rtObjek = req.body.rtObjek || '-';
      let rwObjek = req.body.rwObjek || '-';
      let status = req.body.status || [];
      let pekerjaan = req.body.pekerjaan || [];
      let namaJalanWajib = req.body.namaJalanWajib || '-';
      let blokKavNoWajib = req.body.blokKavNoWajib || '-';
      let kelurahanWajib = req.body.kelurahanWajib || '-';
      let rtWajib = req.body.rtWajib || '-';
      let rwWajib = req.body.rwWajib || '-';
      let kabupaten = req.body.kabupaten || '-';
      let noKtp = req.body.noKtp || '-';
      let zntBaru = req.body.zntBaru || '-';
      let luasTanahBaru = req.body.luasTanahBaru || '-';
      let jenisTanah = req.body.jenisTanah || [];
      let keterangan = req.body.keterangan || [];

      var idTanah = req.session.idTanah;
  
      connection.query(
        "UPDATE tanah SET nop = ?, lt = ?, lb = ?, znt = ?, alamat_objek_pajak = ?, nama_subjek_pajak = ?, alamat_wajib_pajak = ?, jenis_transaksi = ?, nop_induk = ?, nop_baru = ?, nama_jalan_objek = ?, blok_kav_no_objek = ?, kelurahan_objek = ?, rt_objek = ?, rw_objek = ?, status = ?, pekerjaan = ?, nama_jalan_wajib = ?, blok_kav_no_wajib = ?, kelurahan_wajib = ?, rt_wajib = ?, rw_wajib = ?, kabupaten = ?, no_ktp = ?, znt_baru = ?, luas_tanah_baru = ?, jenis_tanah = ?, keterangan = ? WHERE id_tanah = ?",
        [
          nop,
          lt,
          lb,
          znt,
          alamatObjekPajak,
          namaSubjekPajak,
          alamatWajibPajak,
          jenisTransaksi.join(","),
          nopInduk,
          nopBaru,
          namaJalanObjek,
          blokKavNoObjek,
          kelurahanObjek,
          rtObjek,
          rwObjek,
          status.join(","),
          pekerjaan.join(","),
          namaJalanWajib,
          blokKavNoWajib,
          kelurahanWajib,
          rtWajib,
          rwWajib,
          kabupaten,
          noKtp,
          zntBaru,
          luasTanahBaru,
          jenisTanah.join(","),
          keterangan.join(","),
          idTanah
        ],
        function (error, results) {
          if (error) throw error;
          res.redirect("/surveyor/datatanah");
        }
      );
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
    res.render("surveyor/tanah", {
      tittle: "Data Tanah",
              tanah: dataTanah,
      username: req.session.username
    });
  });
} else {
    res.redirect("/login");
}
  });
  
  router.post("/updatetanah", function (req, res) {
    let tanahId = req.body.id_tanah;
    let nop = req.body.nop;
    let lt = req.body.lt;
    let lb = req.body.lb;
    let znt = req.body.znt;
    let alamatObjekPajak = req.body.alamatObjekPajak;
    let namaSubjekPajak = req.body.namaSubjekPajak;
    let alamatWajibPajak = req.body.alamatWajibPajak;
    let jenisTransaksi = req.body.jenisTransaksi;
    let nopInduk = req.body.nopInduk;
    let nopBaru = req.body.nopBaru;
    let namaJalanObjek = req.body.namaJalanObjek;
    let blokKavNoObjek = req.body.blokKavNoObjek;
    let kelurahanObjek = req.body.kelurahanObjek;
    let rtObjek = req.body.rtObjek;
    let rwObjek = req.body.rwObjek;
    let status = req.body.status;
    let pekerjaan = req.body.pekerjaan;
    let namaJalanWajib = req.body.namaJalanWajib;
    let blokKavNoWajib = req.body.blokKavNoWajib;
    let kelurahanWajib = req.body.kelurahanWajib;
    let rtWajib = req.body.rtWajib;
    let rwWajib = req.body.rwWajib;
    let kabupaten = req.body.kabupaten;
    let noKtp = req.body.noKtp;
    let zntBaru = req.body.zntBaru;
    let luasTanahBaru = req.body.luasTanahBaru;
    let jenisTanah = req.body.jenisTanah;
    let keterangan = req.body.keterangan;

    let sql = "UPDATE tanah SET nop = ?, lt = ?, lb = ?, znt = ?, alamat_objek_pajak = ?, nama_subjek_pajak = ?, alamat_wajib_pajak = ?, jenis_transaksi = ?, nop_induk = ?, nop_baru = ?, nama_jalan_objek = ?, blok_kav_no_objek = ?, kelurahan_objek = ?, rt_objek = ?, rw_objek = ?, status = ?, pekerjaan = ?, nama_jalan_wajib = ?, blok_kav_no_wajib = ?, kelurahan_wajib = ?, rt_wajib = ?, rw_wajib = ?, kabupaten = ?, no_ktp = ?, znt_baru = ?, luas_tanah_baru = ?, jenis_tanah = ?, keterangan = ? WHERE id_tanah = ?";
    connection.query(sql, [
      nop,
      lt,
      lb,
      znt,
      alamatObjekPajak,
      namaSubjekPajak,
      alamatWajibPajak,
      jenisTransaksi,
      nopInduk,
      nopBaru,
      namaJalanObjek,
      blokKavNoObjek,
      kelurahanObjek,
      rtObjek,
      rwObjek,
      status,
      pekerjaan,
      namaJalanWajib,
      blokKavNoWajib,
      kelurahanWajib,
      rtWajib,
      rwWajib,
      kabupaten,
      noKtp,
      zntBaru,
      luasTanahBaru,
      jenisTanah,
      keterangan,
      tanahId,
    ],(err) => {
      if (err) {
        console.log(err);
        req.flash("error", "Terjadi kesalahan saat mengupdate data!");
      } else {
        req.flash("success", "Data berhasil diupdate!");
      }
      res.redirect("/surveyor/datatanah");
    });
  });

  router.post("/deletetanah", (req, res) => {
    let sql = "DELETE FROM tanah WHERE id_tanah=" + req.body.id_tanah + "";
    connection.query(sql, (err) => {
      req.flash('error', 'Data Berhasil Dihapus!');
      if (err) throw err;
      res.redirect("/surveyor/datatanah");
    });
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