-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.17 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for eg-farm
CREATE DATABASE IF NOT EXISTS `eg-farm` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `eg-farm`;

-- Dumping structure for table eg-farm.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `Phone` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table eg-farm.users: ~3 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `verification_code`, `verified`, `Phone`, `Address`, `resetToken`) VALUES
	(1, 'admin', 'leminhhuy8689@gmail.com', '$2b$10$Ub2hlrzdjF7Rwl8jj7e0ButCeTn8bjsAbIiYROyaKi6rUSwMh/KxK', '1', '592018', 1, '054234314', 'ahdfafkrfgsedfet', NULL),
	(2, 'user1', 'leminheaffa@gmail.com', '$2b$10$QKa1vMi6/1OasxfL7.l78e31VV6LbXBZSULgutBh.Si3oeVGmDV8a', '0', '918115', 1, '054234314', 'ahdfafkrfgsedfet', NULL),
	(4, 'user3', 'asdgvcxfq@gmail.com', '$2b$10$fmAjXX/apl41k8LrZL/CB.Im2mpC2V4ZUr8qxb5CFL1JBhHDvkoym', '0', '189184', 1, '0595u23453u', 'ahdfaugieffuhsfvio', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
