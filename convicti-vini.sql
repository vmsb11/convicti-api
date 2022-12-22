-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 22-Dez-2022 às 19:28
-- Versão do servidor: 10.4.14-MariaDB
-- versão do PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `convicti`
--
CREATE DATABASE IF NOT EXISTS `convicti` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `convicti`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `boards`
--

DROP TABLE IF EXISTS `boards`;
CREATE TABLE IF NOT EXISTS `boards` (
  `boardId` int(10) NOT NULL AUTO_INCREMENT,
  `directorId` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`boardId`),
  KEY `FK_DIRECTOR_BOARD` (`directorId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `boards`
--

INSERT INTO `boards` (`boardId`, `directorId`, `name`, `createdAt`, `updatedAt`) VALUES
(2, 2, 'Sul', '2022-12-22 11:38:42', '2022-12-22 11:39:39'),
(3, 3, 'Sudeste', '2022-12-22 11:42:07', '2022-12-22 11:42:07'),
(4, 4, 'Centro-oeste', '2022-12-22 11:42:25', '2022-12-22 11:42:25');

-- --------------------------------------------------------

--
-- Estrutura da tabela `directors`
--

DROP TABLE IF EXISTS `directors`;
CREATE TABLE IF NOT EXISTS `directors` (
  `directorId` int(10) NOT NULL AUTO_INCREMENT,
  `userId` int(10) NOT NULL,
  `generalManager` varchar(3) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`directorId`),
  KEY `FK_USER_DIRECTOR` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `directors`
--

INSERT INTO `directors` (`directorId`, `userId`, `generalManager`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Sim', '2022-12-22 10:51:09', '2022-12-22 11:00:36'),
(2, 3, 'Não', '2022-12-22 10:52:08', '2022-12-22 10:52:08'),
(3, 4, 'Não', '2022-12-22 10:52:16', '2022-12-22 10:52:16'),
(4, 5, 'Não', '2022-12-22 10:52:25', '2022-12-22 10:52:25');

-- --------------------------------------------------------

--
-- Estrutura da tabela `managers`
--

DROP TABLE IF EXISTS `managers`;
CREATE TABLE IF NOT EXISTS `managers` (
  `managerId` int(10) NOT NULL AUTO_INCREMENT,
  `userId` int(10) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`managerId`),
  KEY `FK_USER_MANAGER` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `managers`
--

INSERT INTO `managers` (`managerId`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 6, '2022-12-22 11:57:55', '2022-12-22 11:57:55'),
(2, 7, '2022-12-22 11:58:04', '2022-12-22 11:58:04'),
(3, 8, '2022-12-22 11:58:08', '2022-12-22 11:58:08'),
(4, 9, '2022-12-22 11:58:13', '2022-12-22 11:58:13'),
(5, 10, '2022-12-22 11:58:20', '2022-12-22 11:58:20'),
(6, 11, '2022-12-22 11:58:28', '2022-12-22 11:58:28'),
(7, 12, '2022-12-22 11:58:36', '2022-12-22 11:58:36'),
(8, 13, '2022-12-22 11:58:43', '2022-12-22 11:58:43'),
(9, 14, '2022-12-22 11:58:51', '2022-12-22 11:58:51'),
(10, 15, '2022-12-22 11:59:01', '2022-12-22 11:59:01'),
(11, 16, '2022-12-22 11:59:07', '2022-12-22 11:59:07');

-- --------------------------------------------------------

--
-- Estrutura da tabela `sales`
--

DROP TABLE IF EXISTS `sales`;
CREATE TABLE IF NOT EXISTS `sales` (
  `saleId` int(10) NOT NULL AUTO_INCREMENT,
  `sellerId` int(10) NOT NULL,
  `boardId` int(10) NOT NULL,
  `unityId` int(10) NOT NULL,
  `managerId` int(10) NOT NULL,
  `date` datetime NOT NULL,
  `amount` double NOT NULL,
  `location` varchar(100) NOT NULL,
  `status` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`saleId`),
  KEY `FK_SALE_SELLER` (`sellerId`),
  KEY `FK_SALE_BOARD` (`boardId`),
  KEY `FK_SALE_UNITY` (`unityId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `sales`
--

INSERT INTO `sales` (`saleId`, `sellerId`, `boardId`, `unityId`, `managerId`, `date`, `amount`, `location`, `status`, `createdAt`, `updatedAt`) VALUES
(4, 6, 3, 7, 6, '2022-01-01 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:48:13', '2022-12-22 13:48:13'),
(5, 6, 3, 7, 6, '2022-01-06 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:48:17', '2022-12-22 13:48:17'),
(6, 6, 3, 7, 6, '2022-01-12 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:48:24', '2022-12-22 13:48:24'),
(7, 7, 3, 7, 6, '2022-01-12 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:48:46', '2022-12-22 13:48:46'),
(8, 7, 3, 7, 6, '2022-01-06 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:48:53', '2022-12-22 13:48:53'),
(9, 7, 3, 7, 6, '2022-01-01 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:48:57', '2022-12-22 13:48:57'),
(10, 12, 4, 9, 0, '2022-01-01 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:52:37', '2022-12-22 13:52:37'),
(11, 12, 4, 9, 0, '2022-01-06 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:52:49', '2022-12-22 13:52:49'),
(12, 12, 4, 9, 0, '2022-01-12 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:52:54', '2022-12-22 13:52:54'),
(13, 13, 4, 9, 0, '2022-01-12 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:53:10', '2022-12-22 13:53:10'),
(14, 13, 4, 9, 0, '2022-01-01 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:53:15', '2022-12-22 13:53:15'),
(15, 13, 4, 9, 0, '2022-01-06 10:00:00', 100, '-23.544259437612844, -46.64370714029131', 'Confirmado', '2022-12-22 13:53:22', '2022-12-22 13:53:22');

-- --------------------------------------------------------

--
-- Estrutura da tabela `sellers`
--

DROP TABLE IF EXISTS `sellers`;
CREATE TABLE IF NOT EXISTS `sellers` (
  `sellerId` int(10) NOT NULL AUTO_INCREMENT,
  `userId` int(10) NOT NULL,
  `unityId` int(10) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sellerId`),
  KEY `FK_SELLER_USER` (`userId`),
  KEY `FK_SELLER_UNITY` (`unityId`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `sellers`
--

INSERT INTO `sellers` (`sellerId`, `userId`, `unityId`, `createdAt`, `updatedAt`) VALUES
(6, 16, 7, '2022-12-22 13:03:29', '2022-12-22 13:03:29'),
(7, 17, 7, '2022-12-22 13:03:34', '2022-12-22 13:03:34'),
(8, 18, 7, '2022-12-22 13:03:38', '2022-12-22 13:03:38'),
(9, 19, 7, '2022-12-22 13:03:45', '2022-12-22 13:03:45'),
(10, 20, 7, '2022-12-22 13:03:50', '2022-12-22 13:03:50'),
(11, 21, 9, '2022-12-22 13:06:17', '2022-12-22 13:06:17'),
(12, 22, 9, '2022-12-22 13:06:21', '2022-12-22 13:06:21'),
(13, 23, 9, '2022-12-22 13:06:30', '2022-12-22 13:06:30'),
(14, 24, 9, '2022-12-22 13:06:34', '2022-12-22 13:06:34'),
(15, 25, 9, '2022-12-22 13:06:39', '2022-12-22 13:06:39'),
(16, 26, 11, '2022-12-22 13:07:07', '2022-12-22 13:07:07'),
(17, 27, 11, '2022-12-22 13:07:11', '2022-12-22 13:07:11'),
(18, 28, 11, '2022-12-22 13:07:17', '2022-12-22 13:07:17'),
(19, 29, 11, '2022-12-22 13:07:20', '2022-12-22 13:07:20'),
(20, 30, 11, '2022-12-22 13:07:27', '2022-12-22 13:07:27'),
(21, 31, 4, '2022-12-22 13:08:00', '2022-12-22 13:08:00'),
(22, 32, 4, '2022-12-22 13:08:04', '2022-12-22 13:08:04'),
(23, 33, 4, '2022-12-22 13:08:08', '2022-12-22 13:08:08'),
(24, 34, 4, '2022-12-22 13:08:11', '2022-12-22 13:08:11'),
(25, 35, 4, '2022-12-22 13:08:15', '2022-12-22 13:08:15'),
(26, 36, 3, '2022-12-22 13:08:46', '2022-12-22 13:08:46'),
(27, 37, 3, '2022-12-22 13:08:50', '2022-12-22 13:08:50'),
(28, 38, 3, '2022-12-22 13:08:55', '2022-12-22 13:08:55'),
(29, 39, 3, '2022-12-22 13:08:58', '2022-12-22 13:08:58'),
(30, 40, 3, '2022-12-22 13:09:04', '2022-12-22 13:09:04'),
(31, 41, 10, '2022-12-22 13:09:35', '2022-12-22 13:09:35'),
(32, 42, 10, '2022-12-22 13:09:39', '2022-12-22 13:09:39'),
(33, 43, 10, '2022-12-22 13:09:44', '2022-12-22 13:09:44'),
(34, 44, 10, '2022-12-22 13:09:48', '2022-12-22 13:09:48'),
(35, 45, 10, '2022-12-22 13:09:55', '2022-12-22 13:09:55'),
(36, 46, 2, '2022-12-22 13:10:27', '2022-12-22 13:10:27'),
(37, 47, 2, '2022-12-22 13:10:31', '2022-12-22 13:10:31'),
(38, 48, 2, '2022-12-22 13:10:34', '2022-12-22 13:10:34'),
(39, 49, 2, '2022-12-22 13:10:38', '2022-12-22 13:10:38'),
(40, 50, 2, '2022-12-22 13:10:43', '2022-12-22 13:10:43'),
(41, 51, 6, '2022-12-22 13:11:08', '2022-12-22 13:11:08'),
(42, 52, 6, '2022-12-22 13:11:12', '2022-12-22 13:11:12'),
(43, 53, 6, '2022-12-22 13:11:16', '2022-12-22 13:11:16'),
(44, 54, 6, '2022-12-22 13:11:19', '2022-12-22 13:11:19'),
(45, 55, 6, '2022-12-22 13:11:24', '2022-12-22 13:11:24'),
(46, 56, 5, '2022-12-22 13:11:38', '2022-12-22 13:11:38'),
(47, 57, 5, '2022-12-22 13:11:41', '2022-12-22 13:11:41'),
(48, 58, 5, '2022-12-22 13:11:46', '2022-12-22 13:11:46'),
(49, 59, 5, '2022-12-22 13:11:50', '2022-12-22 13:11:50'),
(50, 60, 5, '2022-12-22 13:11:54', '2022-12-22 13:11:54'),
(51, 61, 8, '2022-12-22 13:12:09', '2022-12-22 13:12:09'),
(52, 62, 8, '2022-12-22 13:12:12', '2022-12-22 13:12:12'),
(53, 63, 8, '2022-12-22 13:12:16', '2022-12-22 13:12:16'),
(54, 64, 8, '2022-12-22 13:12:20', '2022-12-22 13:12:20'),
(56, 65, 8, '2022-12-22 13:12:30', '2022-12-22 13:12:30');

-- --------------------------------------------------------

--
-- Estrutura da tabela `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE IF NOT EXISTS `units` (
  `unityId` int(10) NOT NULL AUTO_INCREMENT,
  `managerId` int(10) NOT NULL,
  `boardId` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `latLon` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`unityId`),
  KEY `FK_BOARD_UNITY` (`boardId`),
  KEY `FK_BOARD_MANAGER` (`managerId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `units`
--

INSERT INTO `units` (`unityId`, `managerId`, `boardId`, `name`, `latLon`, `createdAt`, `updatedAt`) VALUES
(2, 1, 2, 'Porto Alegre', '-30.048750057541955, -51.228587422990806', '2022-12-22 12:18:34', '2022-12-22 12:18:34'),
(3, 2, 2, 'Florianópolis', '-27.55393525017396, -48.49841515885026', '2022-12-22 12:19:15', '2022-12-22 12:19:15'),
(4, 3, 2, 'Curitiba', '-25.473704465731746, -49.24787198992874', '2022-12-22 12:19:43', '2022-12-22 12:19:43'),
(5, 4, 3, 'São Paulo', '-23.544259437612844, -46.64370714029131', '2022-12-22 12:20:19', '2022-12-22 12:20:19'),
(6, 5, 3, 'Rio de Janeiro', '-22.923447510604802, -43.23208495438858', '2022-12-22 12:20:41', '2022-12-22 12:20:41'),
(7, 6, 3, 'Belo Horizonte', '-19.917854829716372, -43.94089385954766', '2022-12-22 12:21:26', '2022-12-22 12:21:26'),
(8, 7, 3, 'Vitória', '-20.340992420772206, -40.38332271475097', '2022-12-22 12:21:48', '2022-12-22 12:21:48'),
(9, 8, 4, 'Campo Grande', '-20.462652006300377, -54.615658937666645', '2022-12-22 12:23:19', '2022-12-22 12:23:19'),
(10, 9, 4, 'Goiânia', '-16.673126240814387, -49.25248826354209', '2022-12-22 12:23:45', '2022-12-22 12:23:45'),
(11, 10, 4, 'Cuiabá', '-15.601754458320842, -56.09832706558089', '2022-12-22 12:24:21', '2022-12-22 12:24:21');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `occupation` varchar(30) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `password` varchar(16) NOT NULL,
  `status` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`userId`, `name`, `occupation`, `mail`, `password`, `status`, `createdAt`, `updatedAt`) VALUES
(2, 'Edson A. do Nascimento', 'Diretor Geral', 'pele@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(3, 'Vagner Mancini', 'Diretor', 'vagner.mancini@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:57:59', '2022-12-22 00:57:59'),
(4, 'Abel Ferreira', 'Diretor', 'abel.ferreira@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:58:29', '2022-12-22 00:58:29'),
(5, 'Rogerio Ceni', 'Diretor', 'rogerio.ceni@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:58:53', '2022-12-22 00:58:53'),
(6, 'Ronaldinho Gaucho', 'Gerente', 'ronaldinho.gaucho@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:00:15', '2022-12-22 01:00:15'),
(7, 'Roberto Firmino', 'Gerente', 'roberto.firmino@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:00:40', '2022-12-22 01:00:40'),
(8, 'Alex de Souza', 'Gerente', 'alex.de.souza@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:01:01', '2022-12-22 01:01:01'),
(9, 'Françoaldo Souza', 'Gerente', 'françoaldo.souza@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:01:19', '2022-12-22 01:01:19'),
(10, 'Romário Faria', 'Gerente', 'romário.faria@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:01:41', '2022-12-22 01:01:41'),
(11, 'Ricardo Goulart', 'Gerente', 'ricardo.goulart@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:01:58', '2022-12-22 01:01:58'),
(12, 'Dejan Petkovic', 'Gerente', 'dejan.petkovic@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:02:39', '2022-12-22 01:02:39'),
(13, 'Deyverson Acosta', 'Gerente', 'deyverson.acosta@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:02:58', '2022-12-22 01:02:58'),
(14, 'Harlei Silva', 'Gerente', 'harlei.silva@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:03:27', '2022-12-22 01:03:27'),
(15, 'Walter Henrique', 'Gerente', 'walter.henrique@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 01:03:45', '2022-12-22 10:30:17'),
(16, 'Afonso Afancar', 'Vendedor', 'afonso.afancar@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(17, 'Alceu Andreoli', 'Vendedor', 'alceu.andreoli@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(18, 'Amalia Zago', 'Vendedor', 'amalia.zago@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(19, 'Carlos Eduardo', 'Vendedor', 'carlos.eduardo@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(20, 'Luiz Felipe', 'Vendedor', 'luiz.felipe@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(21, 'Breno', 'Vendedor', 'breno@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(22, 'Emanuel', 'Vendedor', 'emanuel@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(23, 'Ryan', 'Vendedor', 'ryan@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(24, 'Vitor Hugo', 'Vendedor', 'vitor.hugo@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(25, 'Yuri', 'Vendedor', 'yuri@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(26, 'Benjamin', 'Vendedor', 'benjamin@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(27, 'Erick', 'Vendedor', 'erick@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(28, 'Enzo Gabriel', 'Vendedor', 'enzo.gabriel@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(29, 'Fernando', 'Vendedor', 'fernando@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(30, 'Joaquim', 'Vendedor', 'joaquim@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(31, 'André', 'Vendedor', 'andré@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(32, 'Raul', 'Vendedor', 'raul@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(33, 'Marcelo', 'Vendedor', 'marcelo@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(34, 'Julio César', 'Vendedor', 'julio.césar@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(35, 'Cauê', 'Vendedor', 'cauê@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(36, 'Benício', 'Vendedor', 'benício@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(37, 'Vitor Gabriel', 'Vendedor', 'vitor.gabriel@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(38, 'Augusto', 'Vendedor', 'augusto@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(39, 'Pedro Lucas', 'Vendedor', 'pedro.lucas@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(40, 'Luiz Gustavo', 'Vendedor', 'luiz.gustavo@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(41, 'Giovanni', 'Vendedor', 'giovanni@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(42, 'Renato', 'Vendedor', 'renato@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(43, 'Diego', 'Vendedor', 'diego@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(44, 'João Paulo', 'Vendedor', 'joão.paulo@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(45, 'Renan', 'Vendedor', 'renan@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(46, 'Luiz Fernando', 'Vendedor', 'luiz.fernando@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(47, 'Anthony', 'Vendedor', 'anthony@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(48, 'Lucas Gabriel', 'Vendedor', 'lucas.gabriel@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(49, 'Thales', 'Vendedor', 'thales@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(50, 'Luiz Miguel', 'Vendedor', 'luiz.miguel@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(51, 'Henry', 'Vendedor', 'henry@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(52, 'Marcos Vinicius', 'Vendedor', 'marcos.vinicius@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(53, 'Kevin', 'Vendedor', 'kevin@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(54, 'Levi', 'Vendedor', 'levi@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(55, 'Enrico', 'Vendedor', 'enrico@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(56, 'João Lucas', 'Vendedor', 'joão.lucas@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(57, 'Hugo', 'Vendedor', 'hugo@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(58, 'Luiz Guilherme', 'Vendedor', 'luiz.guilherme@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(59, 'Matheus Henrique', 'Vendedor', 'matheus.henrique@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(60, 'Miguel', 'Vendedor', 'miguel@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(61, 'Davi', 'Vendedor', 'davi@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(62, 'Gabriel', 'Vendedor', 'gabriel@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(63, 'Arthur', 'Vendedor', 'arthur@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(64, 'Lucas', 'Vendedor', 'lucas@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16'),
(65, 'Matheus', 'Vendedor', 'matheus@magazineaziul.com.br', '123456', 'Ativo', '2022-12-22 00:36:16', '2022-12-22 00:36:16');

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `boards`
--
ALTER TABLE `boards`
  ADD CONSTRAINT `FK_DIRECTOR_BOARD` FOREIGN KEY (`directorId`) REFERENCES `directors` (`directorId`);

--
-- Limitadores para a tabela `directors`
--
ALTER TABLE `directors`
  ADD CONSTRAINT `FK_USER_DIRECTOR` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Limitadores para a tabela `managers`
--
ALTER TABLE `managers`
  ADD CONSTRAINT `FK_USER_MANAGER` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Limitadores para a tabela `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `FK_SALE_BOARD` FOREIGN KEY (`boardId`) REFERENCES `boards` (`boardId`),
  ADD CONSTRAINT `FK_SALE_SELLER` FOREIGN KEY (`sellerId`) REFERENCES `sellers` (`sellerId`),
  ADD CONSTRAINT `FK_SALE_UNITY` FOREIGN KEY (`unityId`) REFERENCES `units` (`unityId`);

--
-- Limitadores para a tabela `sellers`
--
ALTER TABLE `sellers`
  ADD CONSTRAINT `FK_SELLER_UNITY` FOREIGN KEY (`unityId`) REFERENCES `units` (`unityId`),
  ADD CONSTRAINT `FK_SELLER_USER` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Limitadores para a tabela `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `FK_BOARD_MANAGER` FOREIGN KEY (`managerId`) REFERENCES `managers` (`managerId`),
  ADD CONSTRAINT `FK_BOARD_UNITY` FOREIGN KEY (`boardId`) REFERENCES `boards` (`boardId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
