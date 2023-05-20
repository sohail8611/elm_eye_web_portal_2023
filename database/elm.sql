-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 05, 2023 at 07:17 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elm2`
--

-- --------------------------------------------------------

--
-- Table structure for table `invalid_violations`
--

DROP TABLE IF EXISTS `invalid_violations`;
CREATE TABLE IF NOT EXISTS `invalid_violations` (
  `operation_id` varchar(30) NOT NULL,
  `frame_id` varchar(30) NOT NULL,
  `case_type` varchar(30) NOT NULL,
  `confidence` varchar(30) NOT NULL,
  `track_id` varchar(30) NOT NULL,
  `date` varchar(30) NOT NULL,
  `time` varchar(30) NOT NULL,
  `latitude` varchar(10) NOT NULL,
  `longitude` varchar(10) NOT NULL,
  `img` longblob NOT NULL,
  `city` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `map_api`
--

DROP TABLE IF EXISTS `map_api`;
CREATE TABLE IF NOT EXISTS `map_api` (
  `map_api_id` int NOT NULL AUTO_INCREMENT,
  `api` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userid` int NOT NULL,
  `entry_date` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`map_api_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `map_api`
--

INSERT INTO `map_api` (`map_api_id`, `api`, `comment`, `userid`, `entry_date`, `status`) VALUES
(6, 'AIzaSyC0pi36NCYygUaAbn3wQrrmjtairvWDxGY', 'New API', 1, '2022-11-16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `map_tree_view`
--

DROP TABLE IF EXISTS `map_tree_view`;
CREATE TABLE IF NOT EXISTS `map_tree_view` (
  `streetid` int NOT NULL,
  `side01` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `side01_ref` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `side02_ref` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `side02` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_violations` int NOT NULL,
  `upload_date` date NOT NULL,
  PRIMARY KEY (`streetid`,`upload_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `map_view`
--

DROP TABLE IF EXISTS `map_view`;
CREATE TABLE IF NOT EXISTS `map_view` (
  `streetid` int NOT NULL,
  `side01_ref` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `side02_ref` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `side01` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `side02` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_violations` int NOT NULL,
  `upload_date` date NOT NULL,
  PRIMARY KEY (`streetid`,`upload_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `street`
--

DROP TABLE IF EXISTS `street`;
CREATE TABLE IF NOT EXISTS `street` (
  `streetid` int NOT NULL AUTO_INCREMENT,
  `streetname` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `in_use` tinyint NOT NULL,
  `city` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`streetid`)
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `street`
--

INSERT INTO `street` (`streetid`, `streetname`, `in_use`, `city`) VALUES
(0, 'None', 0, ''),
(60, 'None', 0, 'Riyadh'),
(61, 'None', 0, 'Makkah');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `fullname` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_allow` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `fullname`, `username`, `pwd`, `position`, `entry_date`, `city_allow`) VALUES
(1, 'Saleh', 'saleh', '123', 'Reviewer', '2022-11-16', 'Makkah,Riyadh'),
(2, 'Executive', 'exe', '123', 'Admin', '2022-12-05', 'Makkah,Riyadh');

-- --------------------------------------------------------

--
-- Table structure for table `user_log`
--

DROP TABLE IF EXISTS `user_log`;
CREATE TABLE IF NOT EXISTS `user_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `violation_id` int NOT NULL,
  `prev_violation` int NOT NULL,
  `updated_violation` int NOT NULL,
  `prev_street` int NOT NULL,
  `updated_street` int NOT NULL,
  `correct_incorrect` int NOT NULL,
  `sensitivity` tinyint NOT NULL COMMENT '1-high/0/-1-Low',
  `duplicate_main_id` int NOT NULL,
  `duplicated` tinyint NOT NULL COMMENT '1/-1',
  `entry_date` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `violation`
--

DROP TABLE IF EXISTS `violation`;
CREATE TABLE IF NOT EXISTS `violation` (
  `violation_id` int NOT NULL AUTO_INCREMENT,
  `street_id` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `violation_type_id` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `accurate` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `risk` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_img` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `long` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `polygon_img` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `violation_date` date NOT NULL,
  `violation_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `violation_status` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_taken` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_called` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correct` tinyint NOT NULL COMMENT '2 - Duplicate ,1-Correct,0-Incorrect, -1 - Pending, -2 duplicate pending',
  `super_violation_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '0- none, other- violation',
  `operation_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sensitivity` tinyint NOT NULL COMMENT '1-High, 0-Low, -1-Pending',
  PRIMARY KEY (`violation_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `violation_type`
--

DROP TABLE IF EXISTS `violation_type`;
CREATE TABLE IF NOT EXISTS `violation_type` (
  `violationtypeid` int NOT NULL AUTO_INCREMENT,
  `violationname` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`violationtypeid`)
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `violation_type`
--

INSERT INTO `violation_type` (`violationtypeid`, `violationname`) VALUES
(1, 'Minor Asphalt'),
(2, 'Sidewalk'),
(3, 'Lighting'),
(4, 'Cleanliness'),
(5, 'Afforestation'),
(6, 'Fossils'),
(7, 'Major Asphalt'),
(8, 'Rubble Source'),
(9, 'Street Sweeping'),
(10, 'Median'),
(11, 'Communication Tower'),
(12, 'Fly Poster'),
(13, 'Tree'),
(0, 'None'),
(15, 'Grass'),
(16, 'Signboard'),
(17, 'Curbs'),
(18, 'Waste container'),
(19, 'sidewalk'),
(20, 'Lighting pole on'),
(23, 'Traffic cones'),
(29, 'Trees'),
(27, 'Barrier'),
(31, 'Lightning pole off'),
(32, 'Towers'),
(44, 'Repaired Area'),
(43, 'Rubble'),
(35, 'Mountain'),
(36, 'Parking area'),
(37, 'Plant'),
(40, 'Random paintings'),
(41, 'Speed bumps'),
(45, 'Add Sign'),
(46, 'Repaired Area'),
(48, 'Manhole'),
(50, 'Blurred Lane Line'),
(53, 'Construction materials'),
(52, 'Vertical Crack'),
(54, 'Blurred Crosswalk'),
(58, 'Barrier Group'),
(57, 'No Median'),
(62, 'Garbage can'),
(63, 'Garbage'),
(64, 'Fly-posters');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
