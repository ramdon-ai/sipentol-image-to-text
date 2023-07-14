-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Jul 2023 pada 05.53
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scan_ocr`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tanah`
--

CREATE TABLE `tanah` (
  `id_tanah` int(11) NOT NULL,
  `nop` varchar(100) NOT NULL,
  `lt` varchar(100) NOT NULL,
  `lb` varchar(100) NOT NULL,
  `znt` varchar(100) NOT NULL,
  `alamat_objek_pajak` varchar(100) NOT NULL,
  `nama_subjek_pajak` varchar(100) NOT NULL,
  `alamat_wajib_pajak` varchar(100) NOT NULL,
  `jenis_transaksi` varchar(100) NOT NULL,
  `nop_induk` varchar(100) NOT NULL,
  `nop_baru` varchar(100) NOT NULL,
  `nama_jalan_objek` varchar(100) NOT NULL,
  `blok_kav_no_objek` varchar(100) NOT NULL,
  `kelurahan_objek` varchar(100) NOT NULL,
  `rt_objek` varchar(100) NOT NULL,
  `rw_objek` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `pekerjaan` varchar(100) NOT NULL,
  `nama_jalan_wajib` varchar(100) NOT NULL,
  `blok_kav_no_wajib` varchar(100) NOT NULL,
  `kelurahan_wajib` varchar(100) NOT NULL,
  `rt_wajib` varchar(100) NOT NULL,
  `rw_wajib` varchar(100) NOT NULL,
  `kabupaten` varchar(100) NOT NULL,
  `no_ktp` int(16) NOT NULL,
  `luas_tanah_baru` varchar(100) NOT NULL,
  `znt_baru` varchar(100) NOT NULL,
  `jenis_tanah` varchar(100) NOT NULL,
  `keterangan` varchar(100) NOT NULL,
  `tanggal` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tanah`
--

INSERT INTO `tanah` (`id_tanah`, `nop`, `lt`, `lb`, `znt`, `alamat_objek_pajak`, `nama_subjek_pajak`, `alamat_wajib_pajak`, `jenis_transaksi`, `nop_induk`, `nop_baru`, `nama_jalan_objek`, `blok_kav_no_objek`, `kelurahan_objek`, `rt_objek`, `rw_objek`, `status`, `pekerjaan`, `nama_jalan_wajib`, `blok_kav_no_wajib`, `kelurahan_wajib`, `rt_wajib`, `rw_wajib`, `kabupaten`, `no_ktp`, `luas_tanah_baru`, `znt_baru`, `jenis_tanah`, `keterangan`, `tanggal`) VALUES
(3, ': 130.005.039.0113.0 LT:308 LB:42 ZNT:BJ', 'Keterangan: (] Data Tetap () GantiNama () Pecah & Rubah LT (]Rubah LB', ' 42', 'BJ', 'Jl RAYA CIPELEM RT: 002 RW: 06', 'PAHING CS SUMIYATI', 'Jl RAYA CIPELEM RT : 002 RW : 06', '() Perekaman (4 Pemutakhiran = () Penghapusan', '123', '456', 'jalan', '48', 'brexit', '01', '02', 'QJ Pemilik () Penyewa (] Pengelola () Pemakai (] Sengket', '(Q PNS ( Asri C Pensiunan ( Badan _ (*fteinnya', 'Jl RAYA CIPELEM', '49', 'CIPELEM', '002', '06', 'BREBES', 789, ':', 'HJ', '(Q Tanah+Bangunan (] Kavling (] Tanah Kosong = () Fasu', 'Pecah, Rubah LT', '2023-07-12'),
(4, '130.005.039.0113.0', '308', '42', 'BJ', 'Jl RAYA CIPELEM RT: 002 RW: 06', 'PAHING CS SUMIYATI', 'Jl RAYA CIPELEM RT : 002 RW : 06', '-', '-', '-', '-', '-', '-', '-', '-', '\"-\"', '\"-\"', 'Jl RAYA CIPELEM', '-', 'CIPELEM', '002', '06', 'Brebes', 0, '168', '-', '\"-\"', '\"-\"', '2023-07-14'),
(5, '130.005.039.0113.0', '308', '42', 'BJ', 'Jl RAYA CIPELEM RT: 002 RW: 06', 'PAHING CS SUMIYATI', 'Jl RAYA CIPELEM RT : 002 RW : 06', '[]', '-', '-', '-', '-', '-', '-', '-', '[]', '[]', 'Jl RAYA CIPELEM', '-', 'CIPELEM', '002', '06', 'Brebes', 0, '168', '-', '[]', '[]', '2023-07-14'),
(6, '130.005.039.0113.0', '308', '42', 'BJ', 'Jl RAYA CIPELEM RT: 002 RW: 06', 'PAHING CS SUMIYATI', 'Jl RAYA CIPELEM RT : 002 RW : 06', '[null]', '-', '-', '-', '-', '-', '-', '-', '[null]', '[null]', 'Jl RAYA CIPELEM', '-', 'CIPELEM', '002', '06', 'Brebes', 0, '168', '-', '[null]', '[null]', '2023-07-14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_users`, `username`, `email`, `password`, `role`) VALUES
(3, 'surveyor', 'surveyor@gmail.com', '$2b$10$YJISeuw5vp5LDyhEL3gvneDbO56WTFJET/OHdABbeupeJiE8v55me', 'surveyor'),
(4, 'admin', 'admin@gmail.com', '$2b$10$w.K0qmBWB0b1KGugDXgv2eFpB55/IDYiAxG7JlG8E2kEwVMKIadNi', 'admin'),
(5, 'ramdon', 'ramdon@gmail.com', '$2b$10$5NLSZZCHcmJS16EpPkubIuEm9Js23uAfFfgryOCAbGYOJs/vOTwru', 'admin'),
(7, 'rama', 'rama@gmail.com', '$2b$10$tz3fROSSup4Cksl52xp1J.R6.MmXclDjN3CyJTfSbgMRAQqRBbn5C', 'surveyor');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tanah`
--
ALTER TABLE `tanah`
  ADD PRIMARY KEY (`id_tanah`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tanah`
--
ALTER TABLE `tanah`
  MODIFY `id_tanah` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
