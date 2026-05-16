CREATE DATABASE  IF NOT EXISTS `flyticket_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `flyticket_db`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: flyticket_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','$2b$10$SrHZLzUMzBWpN3sRqeSYr.2qwmOQm.FskggJcF4C7dqj9blrEELgW');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(100) NOT NULL,
  PRIMARY KEY (`city_id`),
  UNIQUE KEY `city_name` (`city_name`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Adana'),(2,'Adıyaman'),(3,'Afyonkarahisar'),(4,'Ağrı'),(68,'Aksaray'),(5,'Amasya'),(6,'Ankara'),(7,'Antalya'),(75,'Ardahan'),(8,'Artvin'),(9,'Aydın'),(10,'Balıkesir'),(74,'Bartın'),(72,'Batman'),(69,'Bayburt'),(11,'Bilecik'),(12,'Bingöl'),(13,'Bitlis'),(14,'Bolu'),(15,'Burdur'),(16,'Bursa'),(17,'Çanakkale'),(18,'Çankırı'),(19,'Çorum'),(20,'Denizli'),(21,'Diyarbakır'),(81,'Düzce'),(22,'Edirne'),(23,'Elazığ'),(24,'Erzincan'),(25,'Erzurum'),(26,'Eskişehir'),(27,'Gaziantep'),(28,'Giresun'),(29,'Gümüşhane'),(30,'Hakkari'),(31,'Hatay'),(76,'Iğdır'),(32,'Isparta'),(34,'İstanbul'),(35,'İzmir'),(46,'Kahramanmaraş'),(78,'Karabük'),(70,'Karaman'),(36,'Kars'),(37,'Kastamonu'),(38,'Kayseri'),(79,'Kilis'),(71,'Kırıkkale'),(39,'Kırklareli'),(40,'Kırşehir'),(41,'Kocaeli'),(42,'Konya'),(43,'Kütahya'),(44,'Malatya'),(45,'Manisa'),(47,'Mardin'),(33,'Mersin'),(48,'Muğla'),(49,'Muş'),(50,'Nevşehir'),(51,'Niğde'),(52,'Ordu'),(80,'Osmaniye'),(53,'Rize'),(54,'Sakarya'),(55,'Samsun'),(63,'Şanlıurfa'),(56,'Siirt'),(57,'Sinop'),(58,'Sivas'),(73,'Şırnak'),(59,'Tekirdağ'),(60,'Tokat'),(61,'Trabzon'),(62,'Tunceli'),(64,'Uşak'),(65,'Van'),(77,'Yalova'),(66,'Yozgat'),(67,'Zonguldak');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight` (
  `flight_id` int NOT NULL AUTO_INCREMENT,
  `from_city` int DEFAULT NULL,
  `to_city` int DEFAULT NULL,
  `departure_time` datetime DEFAULT NULL,
  `arrival_time` datetime DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `seats_total` int DEFAULT NULL,
  `seats_available` int DEFAULT NULL,
  PRIMARY KEY (`flight_id`),
  KEY `from_city` (`from_city`),
  KEY `to_city` (`to_city`),
  CONSTRAINT `flight_ibfk_1` FOREIGN KEY (`from_city`) REFERENCES `city` (`city_id`),
  CONSTRAINT `flight_ibfk_2` FOREIGN KEY (`to_city`) REFERENCES `city` (`city_id`),
  CONSTRAINT `chk_seats_available` CHECK ((`seats_available` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
/*!40000 ALTER TABLE `flight` DISABLE KEYS */;
INSERT INTO `flight` VALUES (1,34,6,'2026-05-20 08:00:00','2026-05-20 09:15:00',1500.00,180,179),(2,6,35,'2026-05-20 10:30:00','2026-05-20 11:45:00',1200.00,150,149),(3,35,34,'2026-05-20 13:00:00','2026-05-20 14:10:00',1600.00,180,179),(4,34,7,'2026-05-21 09:00:00','2026-05-21 10:30:00',1800.00,200,199),(5,7,6,'2026-05-21 14:00:00','2026-05-21 15:15:00',1400.00,150,149),(6,6,61,'2026-05-22 08:30:00','2026-05-22 10:00:00',1700.00,180,179),(7,61,34,'2026-05-22 18:00:00','2026-05-22 19:45:00',2000.00,200,199),(8,34,35,'2026-05-23 07:00:00','2026-05-23 08:10:00',1300.00,150,149),(9,35,7,'2026-05-23 16:00:00','2026-05-23 17:10:00',1100.00,150,149),(10,7,34,'2026-05-24 20:00:00','2026-05-24 21:30:00',1900.00,200,199);
/*!40000 ALTER TABLE `flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `passenger_name` varchar(100) DEFAULT NULL,
  `passenger_surname` varchar(100) DEFAULT NULL,
  `passenger_email` varchar(150) DEFAULT NULL,
  `flight_id` int DEFAULT NULL,
  `seat_number` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `unique_seat` (`flight_id`,`seat_number`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (1,'Ahmet','Yılmaz','ahmet.y@mail.com',1,'1'),(2,'Ayşe','Kaya','ayse.k@mail.com',2,'1'),(3,'Mehmet','Demir','mehmet.d@mailk.com',3,'1'),(4,'Fatma','Çelik','fatma.c@mail.com',4,'1'),(5,'Can','Öztürk','can.o@mail.com',5,'1'),(6,'Elif','Şahin','elif.s@mail.com',6,'1'),(7,'Burak','Arslan','burak.a@mail.com',7,'1'),(8,'Zeynep','Doğan','zeynep.d@mail.com',8,'1'),(9,'Emre','Kılıç','emre.k@mail.com',9,'1'),(10,'Selin','Yıldız','selin.y@mail.com',10,'1');
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 15:10:47
