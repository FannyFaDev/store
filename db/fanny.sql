-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 08 Jan 2026 pada 09.20
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fanny`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `auth_tokens`
--

CREATE TABLE `auth_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `auth_tokens`
--

INSERT INTO `auth_tokens` (`id`, `user_id`, `token`, `created_at`) VALUES
(1, 8, 'f2b014c2e47601ce9d38d187ffdad4d3f0ebc3802b7b359ea4319556f71747c8', '2026-01-03 07:48:16'),
(2, 1, '77befe7734db67a4d6e54aa748662afe184cc0498e7c9b72cd9164fef301182d', '2026-01-03 07:51:56'),
(3, 8, 'f516a6fab1ee7e5a995891499e46a5e2a74fa53419220b8ed43330fc49b399ae', '2026-01-03 07:52:35'),
(4, 10, '4f4c28add47dfb38c3fe2fd209578d59a1a576989618de4e4dc2d259b9e1e6b9', '2026-01-03 07:55:47'),
(5, 1, 'f7d38b44e50b04b7eac0c5d1ca54f0a85ac3f0403d2aacd25e3f095d50dff54e', '2026-01-03 07:56:04'),
(6, 1, '939d9ded544b0137351445330d54c65c0f70e6b4f9f45346e8fb70a68a2cc3c0', '2026-01-03 08:01:21'),
(7, 1, '35727d6f5f40a035a84084b7f324e9aebd223a01831a02a5a8df4d4072175eaa', '2026-01-03 08:03:49'),
(8, 1, '81e51068bdaa56bbd5b2f97170ec8c164d45c435f30452896add561f4f62561b', '2026-01-03 08:07:04'),
(9, 1, 'c8fd05ac3added17850e229313adc9623975172a7c945d17f37fe2b261f00e97', '2026-01-03 08:15:01'),
(10, 1, '2f667b8d3403c7de0c8653628e3438a6f0305582546be26f710c3e44ae426678', '2026-01-03 08:17:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(2, 1, '2025-12-29 18:06:18'),
(3, 4, '2025-12-29 18:07:44'),
(4, 2, '2025-12-30 07:05:53'),
(6, 8, '2026-01-02 11:34:12'),
(7, 10, '2026-01-03 01:14:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `item_id`, `quantity`, `created_at`) VALUES
(37, 4, 38, 1, '2026-01-02 15:45:20'),
(38, 7, 37, 1, '2026-01-03 01:14:45'),
(39, 4, 40, 1, '2026-01-04 10:47:54'),
(40, 4, 38, 1, '2026-01-04 10:48:23'),
(41, 2, 40, 1, '2026-01-05 15:18:59'),
(43, 6, 39, 1, '2026-01-07 02:03:49'),
(44, 2, 44, 1, '2026-01-08 07:42:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `comments`
--

INSERT INTO `comments` (`id`, `product_id`, `user_id`, `parent_id`, `text`, `created_at`) VALUES
(1, 8, 1, NULL, 'Hay', '2026-01-01 08:41:05'),
(2, 8, 2, NULL, 'Oi', '2026-01-01 08:41:54'),
(3, 8, 1, NULL, 'tes', '2026-01-01 08:43:07'),
(4, 19, 2, NULL, NULL, '2026-01-01 09:11:16'),
(5, 8, 2, NULL, 'Woi', '2026-01-01 09:15:59'),
(6, 19, 1, NULL, 'Halo', '2026-01-01 09:19:00'),
(7, 19, 1, NULL, 'Hay', '2026-01-01 09:19:03'),
(8, 19, 1, NULL, 'P', '2026-01-01 12:11:21'),
(9, 19, 1, NULL, 'Ppp', '2026-01-01 12:20:01'),
(10, 19, 1, NULL, 'P', '2026-01-01 12:20:04'),
(11, 6, 1, NULL, 'P', '2026-01-01 12:25:14'),
(12, 19, 1, NULL, 'P', '2026-01-01 12:27:11'),
(13, 19, 8, NULL, 'oi', '2026-01-01 12:33:03'),
(14, 19, 1, NULL, 'Y', '2026-01-01 12:33:24'),
(15, 19, 1, NULL, 'Y', '2026-01-01 12:33:33'),
(16, 6, 1, NULL, 'Halk', '2026-01-01 13:36:54'),
(17, 19, 1, 4, 'hY', '2026-01-01 14:14:44'),
(18, 19, 1, 17, 'YA', '2026-01-01 14:14:50'),
(19, 19, 1, 10, 'OI', '2026-01-01 14:15:16'),
(20, 19, 1, 6, 'halo jokowi', '2026-01-01 14:26:36'),
(21, 19, 1, 17, 'hay', '2026-01-01 15:20:27'),
(22, 19, 1, 21, 'hay', '2026-01-01 15:20:36'),
(23, 8, 1, 2, 'bg', '2026-01-01 15:22:03'),
(24, 8, 2, 23, 'Oi', '2026-01-01 15:22:39'),
(25, 8, 1, 24, 'sehat kh lu', '2026-01-01 15:22:52'),
(26, 8, 2, 25, 'Jokowi', '2026-01-01 15:31:00'),
(27, 19, 2, 20, 'P', '2026-01-01 15:31:17'),
(28, 8, 2, NULL, 'Bg', '2026-01-01 15:32:31'),
(29, 8, 1, 28, 'oi', '2026-01-01 15:32:38'),
(30, 8, 2, 29, 'Lu gi ngapin bg', '2026-01-01 15:32:51'),
(31, 8, 1, 30, 'gpp\nkn', '2026-01-01 15:33:03'),
(32, 8, 1, 31, 'oi', '2026-01-01 15:33:18'),
(33, 8, 1, 1, 'bg', '2026-01-01 15:35:57'),
(34, 8, 2, 33, 'Oi', '2026-01-01 15:36:13'),
(35, 8, 2, 33, 'Oi', '2026-01-01 15:36:21'),
(36, 8, 2, 2, 'Oi', '2026-01-01 15:36:31'),
(37, 8, 2, 33, 'Oi', '2026-01-01 15:36:52'),
(38, 8, 2, 33, 'Oi', '2026-01-01 15:36:52'),
(39, 8, 2, 33, 'Oi', '2026-01-01 15:36:52'),
(40, 8, 2, 33, 'Oi', '2026-01-01 15:36:52'),
(41, 8, 2, 33, 'Oi', '2026-01-01 15:36:52'),
(42, 8, 2, 33, 'Oi', '2026-01-01 15:36:52'),
(43, 8, 2, 1, 'Apa', '2026-01-01 15:36:55'),
(44, 8, 2, 23, 'Tes', '2026-01-01 15:37:05'),
(45, 20, 1, NULL, 'wihh keren', '2026-01-01 15:44:43'),
(46, 20, 2, 45, 'Iyakann', '2026-01-01 15:45:08'),
(47, 20, 2, 45, 'Iyakan', '2026-01-01 15:45:21'),
(48, 20, 1, 47, 'tez', '2026-01-01 15:45:45'),
(49, 20, 2, NULL, 'Mantap Bg', '2026-01-01 15:48:21'),
(50, 20, 2, 46, 'Yoi', '2026-01-01 15:51:34'),
(51, 20, 2, 45, 'Oi', '2026-01-01 15:51:44'),
(52, 20, 2, 45, 'Ypi', '2026-01-01 15:52:02'),
(53, 20, 2, 47, 'Iya', '2026-01-01 15:52:17'),
(54, 20, 2, 45, 'Iua', '2026-01-01 15:52:27'),
(55, 20, 1, 45, 'iya', '2026-01-01 15:52:41'),
(56, 20, 1, 49, 'iya', '2026-01-01 15:54:09'),
(57, 20, 2, 56, 'Oke', '2026-01-01 15:54:34'),
(58, 20, 2, 49, 'Btw rumah lu mana', '2026-01-01 15:54:56'),
(59, 20, 1, 49, 'jauh bg di mars', '2026-01-01 15:55:21'),
(60, 20, 2, NULL, 'Oalahh', '2026-01-01 15:55:24'),
(61, 20, 2, 49, 'Ouhh', '2026-01-01 15:55:37'),
(62, 20, 1, 49, 'yoo', '2026-01-01 15:55:52'),
(63, 20, 8, 62, 'Jualan apa lu bjir', '2026-01-01 16:03:46'),
(64, 20, 8, 49, 'Jualan apa lu bjit', '2026-01-01 16:03:54'),
(65, 20, 8, 64, 'Pnl', '2026-01-01 16:04:12'),
(66, 20, 8, 46, 'Oi', '2026-01-01 16:11:46'),
(67, 20, 1, 46, 'halo', '2026-01-01 16:12:53'),
(68, 20, 1, 45, 'hay', '2026-01-01 16:13:03'),
(69, 20, 8, 60, 'Yo', '2026-01-01 16:13:15'),
(70, 20, 8, 49, 'Yo', '2026-01-01 16:13:21'),
(71, 20, 1, 60, 'y', '2026-01-01 16:13:30'),
(72, 20, 8, 49, 'Tes', '2026-01-01 16:13:43'),
(73, 20, 1, NULL, 'tes', '2026-01-01 16:14:08'),
(74, 20, 1, 69, 'haha', '2026-01-01 16:14:16'),
(75, 20, 8, 72, 'Oi', '2026-01-01 16:23:00'),
(76, 20, 1, 69, 'yyy', '2026-01-01 16:23:18'),
(77, 20, 8, 76, 'Yaa', '2026-01-01 16:23:24'),
(78, 20, 1, 77, 'yaa', '2026-01-01 16:23:32'),
(79, 28, 2, NULL, 'halo', '2026-01-02 14:53:44'),
(80, 28, 1, 79, 'Hayy', '2026-01-02 14:54:10'),
(81, 28, 2, 80, 'yooo', '2026-01-02 14:54:38'),
(82, 37, 10, NULL, '\'', '2026-01-03 01:15:04'),
(83, 38, 1, NULL, 'mantapp', '2026-01-06 08:08:38'),
(84, 38, 10, NULL, 'hhh', '2026-01-06 08:09:02'),
(85, 40, 8, NULL, 'tes', '2026-01-06 08:12:33'),
(86, 40, 1, 85, 'yo', '2026-01-06 08:12:46'),
(87, 40, 8, 85, 'w', '2026-01-06 08:13:05'),
(88, 43, 8, NULL, 'tes', '2026-01-07 02:02:19'),
(89, 43, 1, 88, 'oi', '2026-01-07 02:02:36'),
(90, 43, 1, NULL, 'oi', '2026-01-07 02:0240'),
(91, 44, 1, NULL, 'tes', '2026-01-08 07:42:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `comment_likes`
--

INSERT INTO `comment_likes` (`id`, `comment_id`, `user_id`, `created_at`) VALUES
(11, 17, 1, '2026-01-01 14:30:07'),
(16, 7, 1, '2026-01-01 14:30:12'),
(20, 4, 1, '2026-01-01 14:30:26'),
(21, 20, 1, '2026-01-01 14:39:29'),
(24, 6, 1, '2026-01-01 14:39:32'),
(25, 28, 1, '2026-01-01 15:33:24'),
(29, 1, 1, '2026-01-01 15:33:42'),
(30, 2, 1, '2026-01-01 15:33:44'),
(31, 1, 2, '2026-01-01 15:33:50'),
(32, 2, 2, '2026-01-01 15:33:52'),
(33, 45, 2, '2026-01-01 15:53:29'),
(34, 45, 1, '2026-01-01 15:53:36'),
(35, 54, 1, '2026-01-01 15:53:40'),
(36, 49, 8, '2026-01-01 16:13:21'),
(37, 82, 1, '2026-01-03 08:25:40'),
(38, 84, 10, '2026-01-06 08:09:05'),
(39, 85, 8, '2026-01-06 08:12:57'),
(40, 88, 1, '2026-01-07 02:02:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `comment_replies`
--

CREATE TABLE `comment_replies` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `media` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `items`
--

INSERT INTO `items` (`id`, `name`, `price`, `description`, `media`, `created_at`, `stock`) VALUES
(29, 'DIGITAL OCEAN', 20.00, 'AKUN DIGITAL OCEAN', 'product_1767367763562.png', '2026-01-02 15:29:23', 0),
(30, 'BOT WHATSAPP', 50.00, '', 'product_1767367934549.png', '2026-01-02 15:32:14', 0),
(31, 'PANEL PETRODACTYL', 1.00, '1GB = 1K\r\n2GB = 2K\r\n3GB = 3K\r\n4GB = 4K\r\n5GB = 5K\r\n6GB = 6K\r\n7GB = 7K\r\n8GB = 8K\r\n9GB = 9K\r\nUNLI = 10K', 'product_1767368081398.png', '2026-01-02 15:34:41', 0),
(32, 'VPS', 2.00, '', 'product_1767368114089.png', '2026-01-02 15:35:14', 0),
(33, 'TOP UP ALL GAME', 0.00, 'Chat Untuk Melihat Harga.\r\nDapatkan Kode Redem Dan Nikmati Diskonnya!', 'product_1767368188712.png', '2026-01-02 15:36:28', 0),
(34, 'SSH TUNNELING', 1.00, 'Chat Untu Detail Lebih Lanjut', 'product_1767368280873.png', '2026-01-02 15:38:00', 0),
(35, 'SERVER MINECRAFT', 5.00, 'Menyediakan Server Untuk\r\n-Badrock\r\n-Java', 'product_1767368389004.jpeg', '2026-01-02 15:39:49', 0),
(36, 'TERMUX STYLE', 99999999.99, 'Link Termux Apk :\r\n', 'product_1767368478915.png', '2026-01-02 15:41:18', 0),
(37, 'ROBLOX VIP', 4.00, '', 'product_1767368537083.png', '2026-01-02 15:42:17', 0),
(38, 'ANIME PLAY MOD APK', 0.00, 'LINK : https://sfile.mobi/lLQnHOVtQ0w', 'product_1767368666201.jpeg', '2026-01-02 15:43:45', 0),
(39, 'DDOS SERVER WEB', 10.00, 'Tanya Aja Adminnya', 'product_1767368864971.jpeg', '2026-01-02 15:47:44', 0),
(40, 'NOKOS WA', 1.00, 'Cek Aja', 'product_1767369050113.jpeg', '2026-01-02 15:50:50', 0),
(44, 'tes', 123456.00, 'tes', 'product_1767858101100.png', '2026-01-08 07:41:41', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('W-VtBejJHUsENg9yKQHSvAvzqYV__ZEd', 1767515631, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"id":1,"username":"admin","role":"admin","avatar":"avatar_1.jpeg"}}');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `is_verified` tinyint(1) DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `is_verified`, `avatar`, `email`) VALUES
(1, 'admin', '$2b$10$3c0E6aHqDQ9U/9ro/T9kA.EOetxd3bbUr340NQ2EOrXDBsDCE9ezi', 'admin', 0, 'avatar_1.jpeg', NULL),
(2, 'fannyfa', '123456', 'admin', 0, 'avatar_2.jpeg', NULL),
(4, 'Tes', '123456', 'user', 0, 'avatar_4.png', NULL),
(5, 'fanyfadev', '12345678', 'user', 0, NULL, NULL),
(7, 'Tes', '123456', 'user', 0, NULL, NULL),
(8, '123456', '$2b$10$zWHmd5qYcGYUgnlVQwe.0uTIVbdT0U6sudp3oOJXDbl1/bT9xD74e', 'user', 0, 'avatar_8.png', NULL),
(9, 'tes', '123456', 'user', 0, NULL, NULL),
(10, 'teaakun', '123456', 'user', 0, 'avatar_10.png', NULL),
(11, 'Pikri', '123456', 'user', 0, NULL, NULL),
(12, 'user', '123456', 'user', 0, NULL, NULL),
(13, 'admin', '$2b$10$EhnCEBIblVC0EmCBqV2x8.Brdt/VAb2a6B6D60FJjmFCuVYfcnwNK', 'user', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_tokens`
--

CREATE TABLE `user_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_tokens`
--

INSERT INTO `user_tokens` (`id`, `user_id`, `token`, `created_at`) VALUES
(1, 1, 'ada0aeb4-0d41-4638-a7e7-ddc8b7cbb548', '2026-01-06 05:12:47'),
(2, 1, 'a3434208-9d14-4a50-b4b8-345c7619687f', '2026-01-06 05:13:30'),
(3, 1, '5f394629-c0da-4393-861f-8dfad41df4d5', '2026-01-06 05:18:33'),
(4, 1, '016be5d1-e84e-465e-ba2c-3806f3717d87', '2026-01-06 05:19:08'),
(5, 10, 'c9b4b1bb-da0e-4ce6-8205-6dcc29248164', '2026-01-06 05:19:18'),
(6, 1, 'd955505f-dde9-4fe8-bf90-76ea14db32d8', '2026-01-06 05:22:06');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`);
