var express = require("express");
var router = express.Router();
var connection = require('../config/database');
var bcrypt = require('bcrypt');

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

router.get("/", (req, res) => {
    if (req.session.loggedin && req.session.role === "admin") {
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
                      
                      res.render("admin/dashboard", {
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

  router.get("/datausers", (req, res) => {
    if (req.session.loggedin && req.session.role === "admin") {
    connection.query('SELECT * FROM users ORDER BY id_users desc', function (err, dataUsers) {
      if (err) {
        return console.log("error: " + err.message);
      }
          //render ke view posts index
          res.render('admin/users', {
              tittle: "Users",
              user: dataUsers,
              username: req.session.username
          });
      });
    } else {
        res.redirect("/login");
    }
    });

  router.get("/datatanah", (req, res) => {
    if (req.session.loggedin && req.session.role === "admin") {
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

  router.post("/addusers", function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;
  
    if (username && email && password === 0) {
      bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err) throw err;
        connection.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?);", [username, email, hashedPassword, role], function (error, results) {
          if (error) throw error;
          res.redirect('/admin/datausers');
        });
      });
    }
  });

//   router.get("/scanocr", (req, res) => {
//     if (req.session.loggedin && req.session.role === "admin") {
//     var dataArray = req.session.dataArray || [];
//     var nop = '';
//     var lt = '';
//     var lb = '';
//     var znt = '';
//     var alamatObjekPajak = '';
//     var namaSubjekPajak = '';
//     var alamatWajibPajak = '';
//     var jenisTransaksi = '';
//     var status = '';
//     var pekerjaan = '';
//     var keturunan = '';
//     var luasTanah = '';
//     var jenisTanah = '';
//     var keterangan = '';
//     var tindakan = '';
//     var pindahBlok = '';
  
//     // Mencari nilai yang diinginkan dari dataArray
//     for (let i = 0; i < dataArray.length; i++) {
//       const line = dataArray[i];
//       if (line.includes('NOP :')) {
//         nop = line.replace('NOP :', '').trim();
//       } else if (line.includes('LT')) {
//         lt = line.replace('LT:', '').trim();
//       } else if (line.includes('LB')) {
//         lb = line.replace('LB:', '').trim();
//       } else if (line.includes('ZNT')) {
//         znt = line.replace('ZNT:', '').trim();
//       } else if (line.includes('Alamat Objek Pajak')) {
//         alamatObjekPajak = line.replace('Alamat Objek Pajak :', '').trim();
//       } else if (line.includes('Nama Subjek Pajak')) {
//         namaSubjekPajak = line.replace('Nama Subjek Pajak :', '').trim();
//       } else if (line.includes('Alamat Wajib Pajak')) {
//         alamatWajibPajak = line.replace('Alamat Wajib Pajak :', '').trim();
//       } else if (line.includes('Jenis Transaksi :')) {
//         jenisTransaksi = line.replace('Jenis Transaksi :', '').trim();
//       } else if (line.includes('Status :')) {
//         status = line.replace('Status :', '').trim();
//       } else if (line.includes('Pekerjaan :')) {
//         pekerjaan = line.replace('Pekerjaan :', '').trim();
//       } else if (line.includes('Keturahan')) {
//         keturunan = line.replace('Keturahan', '').trim();
//       } else if (line.includes('Luas Tanah Baru')) {
//         luasTanah = line.replace('Luas Tanah Baru =', '').trim();
//       } else if (line.includes('Jenis Tanah :')) {
//         jenisTanah = line.replace('Jenis Tanah :', '').trim();
//       } else if (line.includes('Keterangan:')) {
//         keterangan = line.replace('Keterangan:', '').trim();
//       } else if (line.includes('Hapus () Gabung () Lainnya :')) {
//         tindakan = line.replace('(] Hapus () Gabung () Lainnya :', '').trim();
//       } else if (line.includes('Pindah Ke Blok')) {
//         pindahBlok = line.replace('(] Pindah Ke Blok', '').trim();
//       }
  
//       if (
//         nop !== '' &&
//         lt !== '' &&
//         lb !== '' &&
//         znt !== '' &&
//         alamatObjekPajak !== '' &&
//         namaSubjekPajak !== '' &&
//         alamatWajibPajak !== '' &&
//         jenisTransaksi !== '' &&
//         status !== '' &&
//         pekerjaan !== '' &&
//         keturunan !== '' &&
//         luasTanah !== '' &&
//         jenisTanah !== '' &&
//         keterangan !== '' &&
//         tindakan !== '' &&
//         pindahBlok !== ''
//       ) {
//         break; // Jika semua nilai telah ditemukan, keluar dari loop
//       }
//     }
// } else {
//     res.redirect("/login");
// }
  
//     res.render("admin/ocr", {
//       dataArray: dataArray,
//       nop: nop,
//       lt: lt,
//       lb: lb,
//       znt: znt,
//       alamatObjekPajak: alamatObjekPajak,
//       namaSubjekPajak: namaSubjekPajak,
//       alamatWajibPajak: alamatWajibPajak,
//       jenisTransaksi: jenisTransaksi,
//       status: status,
//       pekerjaan: pekerjaan,
//       keturunan: keturunan,
//       luasTanah: luasTanah,
//       jenisTanah: jenisTanah,
//       keterangan: keterangan,
//       tindakan: tindakan,
//       pindahBlok: pindahBlok,
//       tittle: "ocr",
//       username: req.session.username
//     });
//   });

//   router.post("/upload", upload.single('file'), async (req, res) => {
//     if (req.session.loggedin) {
//     var data = path.join(__dirname, "../uploads/" + req.file.filename);
//     try {
//       await worker.load();
//       await worker.loadLanguage('ind');
//       await worker.initialize('ind');
  
//       var { data: { text } } = await worker.recognize(data);
  
//       await worker.terminate();
  
//       var resultText = text;
//       var dataArray = resultText.split("\n");
//       console.log(dataArray);
  
//       req.session.dataArray = dataArray;
  
//       res.redirect("/admin/scanocr");
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Terjadi kesalahan saat memproses gambar');
//     }
// } else {
//     res.redirect("/login");
// }
//   });

router.post("/updateusers", (req, res) => {
  let userId = req.body.id_users;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;

  if (password) {
    bcrypt.hash(password, 10, function (err, hashedPassword) {
      if (err) throw err;

      // Update username, email, password, and role in the database
      let sql =
        "UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id_users = ?";

      connection.query(
        sql,
        [username, email, hashedPassword, role, userId],
        (err) => {
          if (err) throw err;
          req.flash('success', "Data berhasil diubah");
          res.redirect("/admin/datausers");
        }
      );
    });
  } else {
    // Update username, email, and role in the database (without changing the password)
    let sql =
      "UPDATE users SET username = ?, email = ?, role = ? WHERE id_users = ?";

    connection.query(
      sql,
      [username, email, role, userId],
      (err) => {
        if (err) throw err;
        req.flash('success', "Data berhasil diubah");
        res.redirect("/admin/datausers");
      }
    );
  }
});

  router.post("/deleteusers", (req, res) => {
    let sql = "DELETE FROM users WHERE id_users=" + req.body.id_users + "";
    connection.query(sql, (err) => {
      req.flash('error', 'Data Berhasil Dihapus!');
      if (err) throw err;
      res.redirect("/admin/datausers");
    });
  });

  router.post("/deletetanah", (req, res) => {
    let sql = "DELETE FROM tanah WHERE id_tanah=" + req.body.id_tanah + "";
    connection.query(sql, (err) => {
      req.flash('error', 'Data Berhasil Dihapus!');
      if (err) throw err;
      res.redirect("/admin/datatanah");
    });
  });

  router.post("/updatetanah", function (req, res) {
      let idTanah = req.body.idTanah;
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

      let sql = "UPDATE tanah SET nop = ?, lt = ?, lb = ?, znt = ?, alamat_objek_pajak = ?, nama_subjek_pajak = ?, alamat_wajib_pajak = ?, jenis_transaksi = ?, nop_induk = ?, nop_baru = ?, nama_jalan_objek = ?, blok_kav_no_objek = ?, kelurahan_objek = ?, rt_objek = ?, rw_objek = ?, status = ?, pekerjaan = ?, nama_jalan_wajib = ?, blok_kav_no_wajib = ?, kelurahan_wajib = ?, rt_wajib = ?, rw_wajib = ?, kabupaten = ?, no_ktp = ?, znt_baru = ?, luas_tanah_baru = ?, jenis_tanah = ?, keterangan = ?, tanggal = ? WHERE id_tanah = ?";
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
        idTanah,
      ],(err) => {
        if (err) {
          console.log(err);
          req.flash("error", "Terjadi kesalahan saat mengupdate data!");
        } else {
          req.flash("success", "Data berhasil diupdate!");
        }
        res.redirect("/admin/datatanah");
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