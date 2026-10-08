-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: event_planning_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '9061568a-5229-11f1-a2b7-d674c16cdb04:1-954';

--
-- Table structure for table `app_users`
--

DROP TABLE IF EXISTS `app_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` bit(1) NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','COORDINATOR','CUSTOMER','FINANCE','OPERATIONS_MANAGER','VENDOR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4vj92ux8a2eehds1mdvmks473` (`email`),
  UNIQUE KEY `UKspsnwr241e9k9c8p5xl4k45ih` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_users`
--

LOCK TABLES `app_users` WRITE;
/*!40000 ALTER TABLE `app_users` DISABLE KEYS */;
INSERT INTO `app_users` VALUES (1,'2026-09-17 17:12:05.138824','admin@eventplan.lk',_binary '','System Admin','$2a$10$l/CCDP4cXQDY7uKfpNWXEuR5UaLnZ00E/xMpZ8/sWhX6R0Lf8UnGa','0770000001','ADMIN','2026-09-17 17:12:05.138824','admin'),(2,'2026-09-17 17:12:05.225883','ops@eventplan.lk',_binary '','Nimal Perera','$2a$10$G3itdAr4JsOUabMszGhHPuHPqhWHhHAG3PvBqKVsU0SqMBOtvL9NS','0770000002','OPERATIONS_MANAGER','2026-09-17 17:12:05.225883','ops'),(3,'2026-09-17 17:12:05.294939','coord@eventplan.lk',_binary '','Samanthi Silva','$2a$10$kFJNPFA00R8kcKGih27A1.sbvO.7etjQAaWqXJTquCP7tMloa4z7i','0770000003','COORDINATOR','2026-09-17 17:12:05.294939','coordinator'),(4,'2026-09-17 17:12:05.360744','finance@eventplan.lk',_binary '','Ruwan Fernando','$2a$10$8AnQ7GdqPwKpyjPYf3sZfOVKrRwY4f9WDBGJWbQeO11l5mO2duKSC','0770000004','FINANCE','2026-09-17 17:12:05.360744','finance'),(5,'2026-09-17 17:12:05.430355','vendor@eventplan.lk',_binary '','Golden Plate User','$2a$10$3Z3Ioq.ah50b8X09lexJXeCke6W0edEztNr9rP39Nq/3WfHAv1N1.','0770000005','VENDOR','2026-09-17 19:50:39.900875','vendor'),(6,'2026-09-17 17:12:05.500809','customer@eventplan.lk',_binary '','Lahiru Customer','$2a$10$rYbneOQFnTNPqwbIv7o2X.NKGnIFkWoODkz9OeqsAh5XUKZyV00Rm','0770000006','CUSTOMER','2026-09-17 17:12:05.500809','customer'),(7,'2026-09-17 17:12:05.571866','customer2@eventplan.lk',_binary '','Amaya Perera','$2a$10$OvwfHBCkxeNn.ZM301geUOi8pi7AivAR8MSd.Hl4Zq1bbq9FGKSaq','0770000009','CUSTOMER','2026-09-17 17:12:05.571866','customer2'),(8,'2026-09-17 17:12:05.715336','coord2@eventplan.lk',_binary '','Ishara Jayasinghe','$2a$10$FpKjVwjmdRtWXQzfZAY7bub5bPhwGsoObK/aHbVPFy5Hf3Xe0MHhu','0770000007','COORDINATOR','2026-09-17 17:12:05.715336','coordinator2'),(9,'2026-09-17 17:12:05.786567','coord3@eventplan.lk',_binary '','Dilani Fernando','$2a$10$eXOzHLVsnGWA.hCMyyoOm.gO2elMyBOnEfHKmVlWeSvbnb.UrivDa','0770000008','COORDINATOR','2026-09-17 17:12:05.786567','coordinator3'),(10,'2026-09-17 17:24:05.087638','randiu11@gmail.com',_binary '','Ranidu Nethra','$2a$10$pVKfyB.inRMlBpIYOWcuxOk/Ev/uCz.HOq91/OUNpqpWQFHzMbAQW','0777345123','CUSTOMER','2026-09-17 17:24:05.087638','Ranidu'),(11,'2026-09-18 09:39:59.190091','clara122@gmail.com',_binary '','Clara S','$2a$10$Iw2xbLdOh/IDKEbJ2WXcauSteaF.k7lJ9/UK.0zRdQMe.jhzBVGbu','0765556732','CUSTOMER','2026-09-18 09:39:59.190091','Clara'),(13,'2026-09-18 09:59:01.926814','nethra12@eventplan.lk',_binary '','Nethra Flowers','$2a$10$73geAO/TcveIfe9KlpDHOuFl5faDMLjRHpR56D6ivDv1s2Qas9NdG','0766578931','VENDOR','2026-09-18 10:01:28.893526','vendor2'),(14,'2026-09-20 12:21:53.081601','sandraneha@eventplan.lk',_binary '','Sandra Photography','$2a$10$BkL3JplgJuUQYUraKtEzv.oAQIwF8gGEx6SMFzz2NMxQvvpelvBrS','0777145627','VENDOR','2026-09-20 12:22:27.806976','vendor3'),(15,'2026-09-20 12:27:53.124988','sehaclara@gmail.com',_binary '','Sehansa Clara','$2a$10$Y183PbTTPM6HJCw22rrvLOFWn0vKX/ZzDNqbeELDrD7/VBalmJQB.','0761115034','CUSTOMER','2026-09-20 12:27:53.124988','Sehansa'),(16,'2026-10-03 07:46:54.000000','kasun@lankadecor.com',_binary '','Kasun Fernando','pass123','0779876543','VENDOR','2026-10-03 07:46:54.000000','lanka_decor');
/*!40000 ALTER TABLE `app_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `detail` varchar(400) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'LOGIN','2026-09-17 17:20:14.740815','Signed in as ADMIN','admin'),(2,'LOGIN','2026-09-17 17:22:51.750971','Signed in as VENDOR','vendor'),(3,'REGISTER','2026-09-17 17:24:05.093372','Customer account created','Ranidu'),(4,'LOGIN','2026-09-17 17:24:15.268303','Signed in as CUSTOMER','Ranidu'),(5,'LOGIN','2026-09-17 17:27:38.970641','Signed in as OPERATIONS_MANAGER','ops'),(6,'LOGIN','2026-09-17 17:30:00.608414','Signed in as COORDINATOR','coordinator'),(7,'LOGIN','2026-09-17 17:39:09.419962','Signed in as VENDOR','vendor'),(8,'LOGIN','2026-09-17 17:45:22.660783','Signed in as FINANCE','finance'),(9,'REGISTER','2026-09-18 09:39:59.214097','Customer account created','Clara'),(10,'LOGIN','2026-09-18 09:40:10.245431','Signed in as CUSTOMER','Clara'),(11,'LOGIN','2026-09-18 09:42:12.323561','Signed in as ADMIN','admin'),(12,'LOGIN','2026-09-18 09:43:34.327272','Signed in as OPERATIONS_MANAGER','ops'),(13,'LOGIN','2026-09-18 09:46:05.406079','Signed in as COORDINATOR','coordinator'),(14,'LOGIN','2026-09-18 09:51:29.261285','Signed in as ADMIN','admin'),(15,'LOGIN','2026-09-18 09:52:41.523146','Signed in as VENDOR','vendor2'),(16,'LOGIN','2026-09-18 09:55:48.877667','Signed in as VENDOR','vendor2'),(17,'LOGIN','2026-09-18 09:57:35.306634','Signed in as VENDOR','vendor2'),(18,'LOGIN','2026-09-18 09:58:04.209086','Signed in as ADMIN','admin'),(19,'LOGIN','2026-09-18 09:59:55.655734','Signed in as VENDOR','vendor2'),(20,'LOGIN','2026-09-18 10:01:02.423156','Signed in as ADMIN','admin'),(21,'LOGIN','2026-09-18 10:01:56.584706','Signed in as VENDOR','vendor2'),(22,'LOGIN','2026-09-18 10:02:35.289639','Signed in as VENDOR','vendor2'),(23,'LOGIN','2026-09-18 10:51:49.431264','Signed in as ADMIN','admin'),(24,'LOGIN','2026-09-18 10:52:17.812397','Signed in as VENDOR','vendor2'),(25,'LOGIN','2026-09-18 10:53:06.928556','Signed in as COORDINATOR','coordinator'),(26,'LOGIN','2026-09-18 10:56:19.826515','Signed in as VENDOR','vendor2'),(27,'LOGIN','2026-09-18 10:58:47.976799','Signed in as FINANCE','finance'),(28,'LOGIN','2026-09-18 11:07:37.669141','Signed in as VENDOR','vendor2'),(29,'LOGIN','2026-09-18 11:08:25.734640','Signed in as ADMIN','admin'),(30,'LOGIN','2026-09-20 10:44:13.762864','Signed in as CUSTOMER','Clara'),(31,'LOGIN','2026-09-20 10:46:25.733919','Signed in as VENDOR','vendor2'),(32,'LOGIN','2026-09-20 10:47:22.293167','Signed in as FINANCE','finance'),(33,'LOGIN','2026-09-20 11:29:49.534202','Signed in as VENDOR','vendor2'),(34,'LOGIN','2026-09-20 11:32:27.945911','Signed in as CUSTOMER','Clara'),(35,'LOGIN','2026-09-20 11:45:36.948977','Signed in as COORDINATOR','coordinator'),(36,'LOGIN','2026-09-20 11:47:09.146108','Signed in as OPERATIONS_MANAGER','ops'),(37,'LOGIN','2026-09-20 12:03:55.828480','Signed in as OPERATIONS_MANAGER','ops'),(38,'LOGIN','2026-09-20 12:04:15.448508','Signed in as VENDOR','vendor2'),(39,'LOGIN','2026-09-20 12:04:28.332862','Signed in as COORDINATOR','coordinator'),(40,'LOGIN','2026-09-20 12:17:10.433538','Signed in as VENDOR','vendor2'),(41,'LOGIN','2026-09-20 12:20:28.363382','Signed in as ADMIN','admin'),(42,'LOGIN','2026-09-20 12:24:26.736822','Signed in as OPERATIONS_MANAGER','ops'),(43,'LOGIN','2026-09-20 12:24:47.520994','Signed in as VENDOR','vendor3'),(44,'REGISTER','2026-09-20 12:27:53.128949','Customer account created','Sehansa'),(45,'LOGIN','2026-09-20 12:28:13.356255','Signed in as CUSTOMER','Sehansa'),(46,'LOGIN','2026-09-20 12:39:01.445973','Signed in as FINANCE','finance'),(47,'LOGIN','2026-09-20 13:21:22.887881','Signed in as VENDOR','vendor3'),(48,'LOGIN','2026-09-20 13:44:21.448784','Signed in as VENDOR','vendor3'),(49,'LOGIN','2026-09-26 14:55:13.721792','Signed in as ADMIN','admin'),(50,'LOGIN','2026-09-26 14:58:21.938468','Signed in as OPERATIONS_MANAGER','ops'),(51,'LOGIN','2026-09-26 15:00:07.478322','Signed in as COORDINATOR','coordinator'),(52,'LOGIN','2026-09-26 15:02:30.910809','Signed in as VENDOR','vendor3'),(53,'LOGIN','2026-09-26 15:05:48.528507','Signed in as FINANCE','finance'),(54,'LOGIN','2026-09-26 15:10:51.019405','Signed in as CUSTOMER','customer'),(55,'LOGIN','2026-09-27 23:38:00.708931','Signed in as OPERATIONS_MANAGER','ops');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_documents`
--

DROP TABLE IF EXISTS `booking_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content_type` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `original_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_bytes` bigint NOT NULL,
  `stored_name` varchar(260) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbfs52val39mseo4cu13j2rwlo` (`booking_id`),
  CONSTRAINT `FKbfs52val39mseo4cu13j2rwlo` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_documents`
--

LOCK TABLES `booking_documents` WRITE;
/*!40000 ALTER TABLE `booking_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_message_files`
--

DROP TABLE IF EXISTS `booking_message_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_message_files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content_type` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind` enum('IMAGE','VIDEO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_bytes` bigint NOT NULL,
  `stored_name` varchar(260) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2o08qds1hp7co0dk9se1apw5v` (`message_id`),
  CONSTRAINT `FK2o08qds1hp7co0dk9se1apw5v` FOREIGN KEY (`message_id`) REFERENCES `booking_messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_message_files`
--

LOCK TABLES `booking_message_files` WRITE;
/*!40000 ALTER TABLE `booking_message_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_message_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_messages`
--

DROP TABLE IF EXISTS `booking_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `booking_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8pw84bve8yl7r8b5gaf2qi6tr` (`booking_id`),
  KEY `FKsvo17qjwwts8cn5ogfukplr2d` (`sender_id`),
  CONSTRAINT `FK8pw84bve8yl7r8b5gaf2qi6tr` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `FKsvo17qjwwts8cn5ogfukplr2d` FOREIGN KEY (`sender_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_messages`
--

LOCK TABLES `booking_messages` WRITE;
/*!40000 ALTER TABLE `booking_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_date` date NOT NULL,
  `event_type` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_count` int NOT NULL,
  `notes` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('FAILED','PAID','UNPAID') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reassignment_reason` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reassignment_requested` bit(1) NOT NULL,
  `requested_services` varchar(400) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','PENDING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `venue` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint NOT NULL,
  `event_id` bigint DEFAULT NULL,
  `package_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKiaolpmnldce3b2cvsj2xf8ma5` (`customer_id`),
  KEY `FK2ww82bk3npaiyu9oeehwtt2q3` (`event_id`),
  KEY `FKrc5y87ewgdwvgowcmns7vthfa` (`package_id`),
  CONSTRAINT `FK2ww82bk3npaiyu9oeehwtt2q3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKiaolpmnldce3b2cvsj2xf8ma5` FOREIGN KEY (`customer_id`) REFERENCES `app_users` (`id`),
  CONSTRAINT `FKrc5y87ewgdwvgowcmns7vthfa` FOREIGN KEY (`package_id`) REFERENCES `event_packages` (`id`),
  CONSTRAINT `bookings_chk_1` CHECK ((`guest_count` >= 1))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'2026-09-20','Proposals & Surprises',11,'guest count may be changed in due time','PAID',NULL,_binary '\0','Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel','CONFIRMED','Nuwara Eliya',10,2,2),(2,'2026-09-20','Birthday Parties',60,'Guest count might be changed','UNPAID',NULL,_binary '\0','Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel','PENDING','Cinnamon Grand',11,3,5),(3,'2026-09-21','Engagements',90,'guest count might change','UNPAID',NULL,_binary '\0','Decorations, stages & drapes, Floral arrangements, Lighting, LED screens, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel','PENDING','Cinnamon Grand',11,4,3),(4,'2026-09-30','Birthday Parties',60,'Location might be changed','UNPAID',NULL,_binary '\0','Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel','PENDING','Mirissa',15,5,5);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget_items`
--

DROP TABLE IF EXISTS `budget_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actual_amount` decimal(12,2) NOT NULL,
  `category` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `planned_amount` decimal(12,2) NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhpmn6fmtvilertv4rdujlxcn0` (`event_id`),
  CONSTRAINT `FKhpmn6fmtvilertv4rdujlxcn0` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_items`
--

LOCK TABLES `budget_items` WRITE;
/*!40000 ALTER TABLE `budget_items` DISABLE KEYS */;
INSERT INTO `budget_items` VALUES (1,0.00,'Decor & florals',60000.00,3);
/*!40000 ALTER TABLE `budget_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coordinator_profiles`
--

DROP TABLE IF EXISTS `coordinator_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordinator_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bio` varchar(800) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialties` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years_experience` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKswpi2rev89jc90isqdkxuuhml` (`user_id`),
  CONSTRAINT `FK6h5073u5bdnbl5xrn7ciy2cdg` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordinator_profiles`
--

LOCK TABLES `coordinator_profiles` WRITE;
/*!40000 ALTER TABLE `coordinator_profiles` DISABLE KEYS */;
INSERT INTO `coordinator_profiles` VALUES (1,'Wedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.','Weddings, homecomings, catering coordination',9,3),(2,'Surprise proposals and intimate celebrations. Discreet location scouting and drone cueing.','Proposals, engagements, drones',6,8),(3,'Corporate, fashion, and concert logistics. Master timelines and backstage flow.','Corporate, fashion, concerts',11,9);
/*!40000 ALTER TABLE `coordinator_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coordinator_reviews`
--

DROP TABLE IF EXISTS `coordinator_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordinator_reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int NOT NULL,
  `reviewer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coordinator_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKc1vusc0oed6wo803jnn15hwgu` (`coordinator_id`),
  CONSTRAINT `FKc1vusc0oed6wo803jnn15hwgu` FOREIGN KEY (`coordinator_id`) REFERENCES `app_users` (`id`),
  CONSTRAINT `coordinator_reviews_chk_1` CHECK (((`rating` <= 5) and (`rating` >= 1)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordinator_reviews`
--

LOCK TABLES `coordinator_reviews` WRITE;
/*!40000 ALTER TABLE `coordinator_reviews` DISABLE KEYS */;
INSERT INTO `coordinator_reviews` VALUES (1,'Handled our wedding timeline calmly and kept the hotel catering on track.','2026-09-17 17:12:05.801427',5,'Nimasha P.',3),(2,'Great bridal and photographer recommendations without pressure.','2026-09-17 17:12:05.803596',4,'Kasun R.',3),(3,'The drone ring delivery and fireworks hit the exact moment. Perfect surprise.','2026-09-17 17:12:05.805650',5,'Amaya L.',8),(4,'Discreet, organized, and always reachable.','2026-09-17 17:12:05.807855',5,'Ruwan T.',8),(5,'Corporate launch ran to the minute.','2026-09-17 17:12:05.810092',4,'Lanka Bank events',9),(6,'Fashion-show backstage and timing were smooth.','2026-09-17 17:12:05.812244',5,'Atelier Noir',9);
/*!40000 ALTER TABLE `coordinator_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `subject` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_address` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4l87ous4rdwshqmugr2333ht1` (`recipient_id`),
  CONSTRAINT `FK4l87ous4rdwshqmugr2333ht1` FOREIGN KEY (`recipient_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_logs`
--

LOCK TABLES `email_logs` WRITE;
/*!40000 ALTER TABLE `email_logs` DISABLE KEYS */;
INSERT INTO `email_logs` VALUES (1,'Hello Ranidu Nethra,\n\nA free dedicated Event Coordinator has been assigned to your request: Proposals & Surprises (Marry Me).\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n','2026-09-17 17:29:24.536112','Your Event Coordinator has been assigned','randiu11@gmail.com',10),(2,'You have been assigned to a customer request.\n\nCustomer: Ranidu Nethra\nPhone: 0777345123\nEmail: randiu11@gmail.com\nPackage: Proposals & Surprises (Marry Me)\nEvent type: Proposals & Surprises\nDate: 2026-09-20\nVenue: Nuwara Eliya\nGuests: 11\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: guest count may be changed in due time\n','2026-09-17 17:29:24.543730','New event assigned to you','coord@eventplan.lk',3),(3,'Ranidu Nethra · Proposals & Surprises (Marry Me)\nScope: Package with changes\nBaseline: LKR 280000.00\nSuggested quote: LKR 200000.00\nAdditions: —\nReductions: decerese the guest count\n\nOverview:\nguest count may be chnaged (test)\n\nCreate the quotation from Package overviews, then send the invoice.','2026-09-17 17:33:56.253198','Package overview ready: Proposals & Surprises (Marry Me)','finance@eventplan.lk',4),(4,'Your coordinator sent the agreed package to finance. You will receive a quotation next. You cannot pay until finance sends that quotation and then the invoice.','2026-09-17 17:33:56.257516','Package sent to finance','randiu11@gmail.com',10),(5,'Quotation QMM - 001 for Proposals & Surprises (Marry Me) — Ranidu Nethra.\nAmount: LKR 200000.00\nProposals & Surprises (Marry Me) baseline LKR 280000.00. Package with changes. guest count may be chnaged (test)\nPlease review. The full invoice amount will be due once finance issues the bill.','2026-09-17 17:46:52.097605','Apex quotation QMM - 001','randiu11@gmail.com',10),(6,'Invoice IMM - 001 for Proposals & Surprises (Marry Me) — Ranidu Nethra.\nAmount: LKR 200000.00\nPlease pay before 2026-09-18.\nThis is the full amount for the event, not a deposit.\nOpen your request in Apex and pay the invoice (sandbox) before that date. Finance is notified as soon as you pay.','2026-09-17 17:47:49.715207','Apex invoice IMM - 001 — pay before 2026-09-18','randiu11@gmail.com',10),(7,'Ranidu Nethra paid the full invoice for Proposals & Surprises (Marry Me) — Ranidu Nethra (LKR 200000.00). Invoice IMM - 001 is now PAID. Full amount is on that event’s books.','2026-09-17 17:48:25.095305','Customer paid: Proposals & Surprises (Marry Me) — Ranidu Nethra','finance@eventplan.lk',4),(8,'We received your payment for Proposals & Surprises (Marry Me) — Ranidu Nethra. Finance has been notified. Amount: LKR 200000.00.','2026-09-17 17:48:25.098592','Payment received by Apex','randiu11@gmail.com',10),(9,'Hello Clara S,\n\nA free dedicated Event Coordinator has been assigned to your request: Birthday Parties.\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n','2026-09-18 09:45:11.222431','Your Event Coordinator has been assigned','clara122@gmail.com',11),(10,'You have been assigned to a customer request.\n\nCustomer: Clara S\nPhone: 0765556732\nEmail: clara122@gmail.com\nPackage: Birthday Parties\nEvent type: Birthday Parties\nDate: 2026-09-20\nVenue: Cinnamon Grand\nGuests: 60\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: Guest count might be changed\n','2026-09-18 09:45:11.227969','New event assigned to you','coord@eventplan.lk',3),(11,'Clara S · Birthday Parties\nScope: Basic package (no changes)\nBaseline: LKR 220000.00\nSuggested quote: LKR 220000.00\nAdditions: Fireworks\nReductions: nothing changed\n\nOverview:\nfull package\n\nCreate the quotation from Package overviews, then send the invoice.','2026-09-18 09:48:04.289141','Package overview ready: Birthday Parties','finance@eventplan.lk',4),(12,'Your coordinator sent the agreed package to finance. You will receive a quotation next. You cannot pay until finance sends that quotation and then the invoice.','2026-09-18 09:48:04.292318','Package sent to finance','clara122@gmail.com',11),(13,'Quotation QMM - 002 for Birthday Parties — Clara S.\nAmount: LKR 220000.00\nAll inclusive package\nPlease review. The full invoice amount will be due once finance issues the bill.','2026-09-18 11:01:59.297853','Ceylon Celebrations quotation QMM - 002','clara122@gmail.com',11),(14,'Invoice IMM - 002 for Birthday Parties — Clara S.\nAmount: LKR 60000.00\nPlease pay before 2026-09-20.\nThis is the full amount for the event, not a deposit.\nOpen your request in Ceylon Celebrations and pay the invoice (sandbox) before that date. Finance is notified as soon as you pay.','2026-09-18 11:02:25.369175','Ceylon Celebrations invoice IMM - 002 — pay before 2026-09-20','clara122@gmail.com',11),(15,'Invoice IMM - 003 for Birthday Parties — Clara S.\nAmount: LKR 160000.00\nPlease pay before 2026-09-20.\nThis is the full amount for the event, not a deposit.\nOpen your request in Ceylon Celebrations and pay the invoice (sandbox) before that date. Finance is notified as soon as you pay.','2026-09-18 11:05:14.456312','Ceylon Celebrations invoice IMM - 003 — pay before 2026-09-20','clara122@gmail.com',11),(16,'Hello Clara S,\n\nA free dedicated Event Coordinator has been assigned to your request: Engagements.\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n','2026-09-20 11:47:40.886958','Your Event Coordinator has been assigned','clara122@gmail.com',11),(17,'You have been assigned to a customer request.\n\nCustomer: Clara S\nPhone: 0765556732\nEmail: clara122@gmail.com\nPackage: Engagements\nEvent type: Engagements\nDate: 2026-09-21\nVenue: Cinnamon Grand\nGuests: 90\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, LED screens, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: guest count might change\n','2026-09-20 11:47:40.893017','New event assigned to you','coord@eventplan.lk',3),(18,'Hello Sehansa Clara,\n\nA free dedicated Event Coordinator has been assigned to your request: Birthday Parties.\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n','2026-09-20 12:30:22.206257','Your Event Coordinator has been assigned','sehaclara@gmail.com',15),(19,'You have been assigned to a customer request.\n\nCustomer: Sehansa Clara\nPhone: 0761115034\nEmail: sehaclara@gmail.com\nPackage: Birthday Parties\nEvent type: Birthday Parties\nDate: 2026-09-30\nVenue: Mirissa\nGuests: 60\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: Location might be changed\n','2026-09-20 12:30:22.210480','New event assigned to you','coord@eventplan.lk',3),(20,'Sehansa Clara · Birthday Parties\nScope: Basic package (no changes)\nBaseline: LKR 220000.00\nSuggested quote: LKR 220000.00\nAdditions: Fireworks\nReductions: Decrease the amount of drones\n\nOverview:\nBaseline\n\nCreate the quotation from Package overviews, then send the invoice.','2026-09-20 12:31:54.743449','Package overview ready: Birthday Parties','finance@eventplan.lk',4),(21,'Your coordinator sent the agreed package to finance. You will receive a quotation next. You cannot pay until finance sends that quotation and then the invoice.','2026-09-20 12:31:54.747172','Package sent to finance','sehaclara@gmail.com',15),(22,'Quotation QMM - 005 for Birthday Parties — Sehansa Clara.\nAmount: LKR 220000.00\nBirthday Parties baseline LKR 220000.00. Basic package (no changes). Baseline\nPlease review. The full invoice amount will be due once finance issues the bill.','2026-09-20 12:39:51.051191','Ceylon Celebrations quotation QMM - 005','sehaclara@gmail.com',15);
/*!40000 ALTER TABLE `email_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_deadlines`
--

DROP TABLE IF EXISTS `event_deadlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_deadlines` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `due_date` date NOT NULL,
  `status` enum('DONE','OPEN','OVERDUE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkfohg4wbndt27d7jmj71qhgjl` (`event_id`),
  CONSTRAINT `FKkfohg4wbndt27d7jmj71qhgjl` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_deadlines`
--

LOCK TABLES `event_deadlines` WRITE;
/*!40000 ALTER TABLE `event_deadlines` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_deadlines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_packages`
--

DROP TABLE IF EXISTS `event_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_packages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `catalog_order` int NOT NULL,
  `category` enum('ANNIVERSARY','BIRTHDAY','CONCERT','CORPORATE','CUSTOM','ENGAGEMENT','FASHION','PROPOSAL','THEME','WEDDING') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ceremony_details` text COLLATE utf8mb4_unicode_ci,
  `custom_canvas` bit(1) NOT NULL,
  `decor_details` text COLLATE utf8mb4_unicode_ci,
  `description` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `drone_details` text COLLATE utf8mb4_unicode_ci,
  `effects_details` text COLLATE utf8mb4_unicode_ci,
  `entertainment_details` text COLLATE utf8mb4_unicode_ci,
  `guest_range` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `published` bit(1) NOT NULL,
  `suggested_guests` int DEFAULT NULL,
  `tagline` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tech_details` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_packages`
--

LOCK TABLES `event_packages` WRITE;
/*!40000 ALTER TABLE `event_packages` DISABLE KEYS */;
INSERT INTO `event_packages` VALUES (1,1,'WEDDING','Included: Free Event Coordinator to manage catering with the hotel and recommend bridal/makeup artists and photographers.',_binary '\0','Custom Poruwa/Phera ceremony setup, setty backs, elegant drapes (curtains), and extensive floral decorations.','A complete wedding and homecoming atmosphere package: Poruwa/Phera ceremony, décor, entertainment, lighting, LED, drones, and fireworks. Bridal wear, suits, and makeup are recommended by your free coordinator — not sold on this site.','Aerial drone photography/videography, and drones for dropping flower leaves over the couple.','Smoke machines for the first dance and outdoor fireworks for the going-away moment.','Ashtaka chanters, traditional dancing teams, and a choice of DJ packages (Bronze, Silver, Gold). Option to add live bands or popular artists (names revealed upon inquiry).','150+ guests','Weddings & Homecomings',950000.00,_binary '',150,'Your most comprehensive fixed package · almost every service we offer','Ambient lighting systems, LED screens for photo montages, smoke machines for the first dance, and outdoor fireworks.'),(2,2,'PROPOSAL','Included: Free Event Coordinator to finalize the secret location and timeline.',_binary '\0','Giant LED \"Marry Me\" letters, fairy-light setups, and romantic floral pathways.','A secret-ready proposal package focused on lighting, fireworks, drone ring delivery, and romantic audio. Your coordinator finalizes the location and timeline with you.','Drone ring delivery (flying the ring directly to the couple) and aerial drone shots.','Fireworks timed to the proposal moment.','Bronze or Silver DJ package for romantic background audio.','Intimate · 10–40 guests','Proposals & Surprises (Marry Me)',280000.00,_binary '',20,'Tech, special effects, and unique delivery for the moment they say yes','Custom lighting systems and fireworks timed to trigger exactly when they say \"Yes.\"'),(3,3,'ENGAGEMENT','Included: Free Event Coordinator to handle venue logistics and vendor recommendations.',_binary '\0','Intimate stage builds, ring-exchange backdrops, elegant room drapes, and floral setups.','An elegant ring-exchange experience with intimate staging, drapes, florals, ambient lighting, and a Silver DJ or acoustic live band.',NULL,'Indoor smoke machines for the couple\'s entrance.','Silver DJ package or acoustic live band.','75–100 guests','Engagements',420000.00,_binary '',90,'Intimate stage, ring-exchange backdrop, and a polished entrance','Ambient lighting and indoor smoke machines for the couple\'s entrance.'),(4,4,'ANNIVERSARY','Included: Free Event Coordinator.',_binary '\0','Sophisticated stage or backdrop setups, elegant drapes, and floral table centerpieces.','A refined anniversary atmosphere with elegant staging, LED family playbacks, tailored lighting, and Silver or Gold DJ entertainment.',NULL,'Tailored lighting for speeches, toasts, and dancing.','Silver or Gold DJ package to get families on the dance floor.','50–120 guests','Anniversaries',350000.00,_binary '',80,'Sophisticated décor, family playbacks, and a dance-floor soundtrack','LED screens for family photo/video playbacks and tailored lighting systems.'),(5,5,'BIRTHDAY','Included: Free Event Coordinator.',_binary '\0','Custom-themed backdrops, balloon and floral installations, and vibrant drapes.','Custom-themed birthday production with balloons, florals, LED, smoke, and DJ packages from Bronze (kids/casual) to Gold (18th/21st) plus live-band options.',NULL,'Smoke machines and vibrant dance-floor lighting.','DJ packages (Bronze for kids/casual, Gold for 18th/21st milestones) and live bands.','30–150 guests','Birthday Parties',220000.00,_binary '',60,'Themed backdrops, dance-floor lighting, and DJ packages from kids to milestones','Dance floor lighting, LED screens, and smoke machines.'),(6,6,'THEME','Included: Free Event Coordinator.',_binary '\0','Custom-built sets matching the specific theme, specialized drapes, and props.','Private themed parties with custom sets, specialized drapes and props, dynamic lighting (neon, retro, and more), smoke, LED, and themed DJs or live bands.',NULL,'Mood-matched lighting and smoke for the dance floor.','Specialized DJ packages or themed live bands.','40–200 guests','Theme Events (Private Parties)',300000.00,_binary '',80,'Custom-built sets, mood lighting, and specialized entertainment','Heavy dynamic lighting to match the mood (neon, retro, and more), smoke machines, and LED screens.'),(7,7,'CORPORATE','Included: Free Event Coordinator to manage catering, venue logistics, and the master timeline.',_binary '\0','Professional corporate stage builds, podium florals, brand-colored drapes, and company flags on display.','Professional corporate production: branded stage, podium florals, massive LED, wireless speech mics, Gold DJ, and indoor fireworks/sparklers for awards. After-party popular artists on inquiry.',NULL,'Indoor fireworks or sparklers for awards and product moments.','Gold DJ package, professional sound systems with wireless mics for speeches, and popular artists for the after-party.','150–200 guests','Corporate Events',1100000.00,_binary '',175,'Stage, branding, LED presentations, and award-night effects','Massive LED screens for presentations, professional lighting rigs, and indoor fireworks/sparklers for award announcements.'),(8,8,'FASHION','Included: Free Event Coordinator to manage backstage flow and timing.',_binary '\0','Custom-built runways, backstage drape setups for changing areas, and backdrop branding.','Runway-ready production with custom-built catwalks, backstage changing drapes, moving-head spotlighting, LED walls, smoke, and a Gold DJ mix for the show.',NULL,'Smoke and spotlighting timed to each look.','Gold DJ package for seamless, high-energy runway music mixing.','80–250 guests','Fashion Shows',650000.00,_binary '',120,'Runway, backstage flow, spotlighting, and high-energy mixing','High-intensity moving-head lighting (spotlighting for models), LED screen walls, and smoke machines.'),(9,9,'CONCERT','Included: Free Event Coordinator to manage talent, technical teams, and scheduling.',_binary '\0','Massive indoor or outdoor stage builds with heavy-duty structural rigging.','Large indoor or outdoor concert production: structural rigging, lasers, massive LED, heavy smoke, stage fireworks, professional PA, Gold DJ, live bands, popular artists, and aerial crowd coverage.','Aerial drone crowd coverage and wide event shots.','Lasers, heavy smoke, and stage fireworks.','Professional-grade PA sound systems, Gold DJ packages, live bands, and popular artists.','300+ guests','Concerts',1800000.00,_binary '',400,'Heavy-duty staging, lasers, LED walls, PA, talent, and aerial coverage','Top-tier lighting systems (lasers, moving heads), massive LED walls, heavy smoke machines, and stage fireworks.'),(10,99,'CUSTOM','Included: Free Event Coordinator to build the event from scratch.',_binary '','Décor, stages, drapes, florals, and lighting scoped to your brief.','Does not fit a standard package? Send the event type, guest count, required services, and your vision. An operator assigns a professional coordinator to build a bespoke quotation.','Drone coverage if requested.','Smoke, fireworks, and other effects if required.','DJ, live band, or artist options after consultation.','Any guest count','Plan a Custom Event',1.00,_binary '',100,'Blank canvas for reunions, exhibitions, and unique briefs','LED, lighting, and PA as requested.');
/*!40000 ALTER TABLE `event_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `end_date` date NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date NOT NULL,
  `status` enum('CANCELLED','COMPLETED','IN_PROGRESS','PLANNED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `venue` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coordinator_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkbxgwpdmkbf3t8fcuyilw98xo` (`coordinator_id`),
  CONSTRAINT `FKkbxgwpdmkbf3t8fcuyilw98xo` FOREIGN KEY (`coordinator_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'2026-11-01','TEST - Sample Gala (for finance/ops CRUD)','Seeded sample event so invoices, quotations, tasks, and deadlines can be attached.','2026-11-01','PLANNED','Corporate Events','Shangri-La Colombo',3),(2,'2026-09-20','Proposals & Surprises (Marry Me) — Ranidu Nethra','Customer request. Guests: 11. Services: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel. guest count may be changed in due time','2026-09-20','PLANNED','Proposals & Surprises','Nuwara Eliya',3),(3,'2026-09-20','Birthday Parties — Clara S','Customer request. Guests: 60. Services: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel. Guest count might be changed','2026-09-20','PLANNED','Birthday Parties','Cinnamon Grand',3),(4,'2026-09-21','Engagements — Clara S','Customer request. Guests: 90. Services: Decorations, stages & drapes, Floral arrangements, Lighting, LED screens, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel. guest count might change','2026-09-21','PLANNED','Engagements','Cinnamon Grand',3),(5,'2026-09-30','Birthday Parties — Sehansa Clara','Customer request. Guests: 60. Services: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel. Location might be changed','2026-09-30','PLANNED','Birthday Parties','Mirissa',3);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(12,2) NOT NULL,
  `due_date` date NOT NULL,
  `invoice_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DRAFT','PAID','SENT','VOID') COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKl1x55mfsay7co0r3m9ynvipd5` (`invoice_number`),
  KEY `FKij6lyp0kvjm2wdst6mee7917y` (`event_id`),
  CONSTRAINT `FKij6lyp0kvjm2wdst6mee7917y` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,200000.00,'2026-09-18','IMM - 001','PAID',2),(2,60000.00,'2026-09-20','IMM - 002','PAID',3),(3,160000.00,'2026-09-20','IMM - 003','SENT',3),(4,220000.00,'2026-09-28','IMM - 005','PAID',5);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_flag` bit(1) NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7mpd9n24ptruj9hf4lw0otrf6` (`recipient_id`),
  CONSTRAINT `FK7mpd9n24ptruj9hf4lw0otrf6` FOREIGN KEY (`recipient_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-09-17 17:25:50.271954','Ranidu Nethra requested Proposals & Surprises (Marry Me). Assign a coordinator from Customer requests.',_binary '\0','Package request',2),(2,'2026-09-17 17:29:24.542788','Hello Ranidu Nethra,\n\nA free dedicated Event Coordinator has been assigned to your request: Proposals & Surprises (Marry Me).\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n',_binary '\0','Your Event Coordinator has been assigned',10),(3,'2026-09-17 17:29:24.544584','You have been assigned to a customer request.\n\nCustomer: Ranidu Nethra\nPhone: 0777345123\nEmail: randiu11@gmail.com\nPackage: Proposals & Surprises (Marry Me)\nEvent type: Proposals & Surprises\nDate: 2026-09-20\nVenue: Nuwara Eliya\nGuests: 11\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: guest count may be changed in due time\n',_binary '\0','New event assigned to you',3),(4,'2026-09-17 17:33:56.255868','Ranidu Nethra · Proposals & Surprises (Marry Me)\nScope: Package with changes\nBaseline: LKR 280000.00\nSuggested quote: LKR 200000.00\nAdditions: —\nReductions: decerese the guest count\n\nOverview:\nguest count may be chnaged (test)\n\nCreate the quotation from Package overviews, then send the invoice.',_binary '\0','Package overview ready: Proposals & Surprises (Marry Me)',4),(5,'2026-09-17 17:33:56.258245','Your coordinator sent the agreed package to finance. You will receive a quotation next. You cannot pay until finance sends that quotation and then the invoice.',_binary '\0','Package sent to finance',10),(6,'2026-09-17 17:38:12.434210','You were assigned to Proposals & Surprises (Marry Me) — Ranidu Nethra on 2026-09-20',_binary '\0','New assignment',5),(7,'2026-09-17 17:46:52.100689','Quotation QMM - 001 for Proposals & Surprises (Marry Me) — Ranidu Nethra.\nAmount: LKR 200000.00\nProposals & Surprises (Marry Me) baseline LKR 280000.00. Package with changes. guest count may be chnaged (test)\nPlease review. The full invoice amount will be due once finance issues the bill.',_binary '\0','Apex quotation QMM - 001',10),(8,'2026-09-17 17:47:49.716993','Invoice IMM - 001 for Proposals & Surprises (Marry Me) — Ranidu Nethra.\nAmount: LKR 200000.00\nPlease pay before 2026-09-18.\nThis is the full amount for the event, not a deposit.\nOpen your request in Apex and pay the invoice (sandbox) before that date. Finance is notified as soon as you pay.',_binary '\0','Apex invoice IMM - 001 — pay before 2026-09-18',10),(9,'2026-09-17 17:48:25.097295','Ranidu Nethra paid the full invoice for Proposals & Surprises (Marry Me) — Ranidu Nethra (LKR 200000.00). Invoice IMM - 001 is now PAID. Full amount is on that event’s books.',_binary '\0','Customer paid: Proposals & Surprises (Marry Me) — Ranidu Nethra',4),(10,'2026-09-17 17:48:25.099590','We received your payment for Proposals & Surprises (Marry Me) — Ranidu Nethra. Finance has been notified. Amount: LKR 200000.00.',_binary '\0','Payment received by Apex',10),(11,'2026-09-17 17:50:05.766555','A vendor payment was recorded for Proposals & Surprises (Marry Me) — Ranidu Nethra: PAID / LKR 180000',_binary '\0','Payment update',5),(12,'2026-09-18 09:41:37.258695','Clara S requested Birthday Parties. Assign a coordinator from Customer requests.',_binary '\0','Package request',2),(13,'2026-09-18 09:45:11.227015','Hello Clara S,\n\nA free dedicated Event Coordinator has been assigned to your request: Birthday Parties.\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n',_binary '\0','Your Event Coordinator has been assigned',11),(14,'2026-09-18 09:45:11.228803','You have been assigned to a customer request.\n\nCustomer: Clara S\nPhone: 0765556732\nEmail: clara122@gmail.com\nPackage: Birthday Parties\nEvent type: Birthday Parties\nDate: 2026-09-20\nVenue: Cinnamon Grand\nGuests: 60\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: Guest count might be changed\n',_binary '\0','New event assigned to you',3),(15,'2026-09-18 09:48:04.291360','Clara S · Birthday Parties\nScope: Basic package (no changes)\nBaseline: LKR 220000.00\nSuggested quote: LKR 220000.00\nAdditions: Fireworks\nReductions: nothing changed\n\nOverview:\nfull package\n\nCreate the quotation from Package overviews, then send the invoice.',_binary '\0','Package overview ready: Birthday Parties',4),(16,'2026-09-18 09:48:04.292956','Your coordinator sent the agreed package to finance. You will receive a quotation next. You cannot pay until finance sends that quotation and then the invoice.',_binary '\0','Package sent to finance',11),(17,'2026-09-18 10:55:01.278504','You were assigned to Birthday Parties — Clara S on 2026-09-20',_binary '\0','New assignment',13),(18,'2026-09-18 11:01:59.304521','Quotation QMM - 002 for Birthday Parties — Clara S.\nAmount: LKR 220000.00\nAll inclusive package\nPlease review. The full invoice amount will be due once finance issues the bill.',_binary '\0','Ceylon Celebrations quotation QMM - 002',11),(19,'2026-09-18 11:02:25.370957','Invoice IMM - 002 for Birthday Parties — Clara S.\nAmount: LKR 60000.00\nPlease pay before 2026-09-20.\nThis is the full amount for the event, not a deposit.\nOpen your request in Ceylon Celebrations and pay the invoice (sandbox) before that date. Finance is notified as soon as you pay.',_binary '\0','Ceylon Celebrations invoice IMM - 002 — pay before 2026-09-20',11),(20,'2026-09-18 11:05:14.458407','Invoice IMM - 003 for Birthday Parties — Clara S.\nAmount: LKR 160000.00\nPlease pay before 2026-09-20.\nThis is the full amount for the event, not a deposit.\nOpen your request in Ceylon Celebrations and pay the invoice (sandbox) before that date. Finance is notified as soon as you pay.',_binary '\0','Ceylon Celebrations invoice IMM - 003 — pay before 2026-09-20',11),(21,'2026-09-18 11:07:20.965342','A vendor payment was recorded for Birthday Parties — Clara S: PAID / LKR 60000',_binary '\0','Payment update',13),(22,'2026-09-20 11:45:56.758847','Clara S requested Engagements. Assign a coordinator from Customer requests.',_binary '\0','Package request',2),(23,'2026-09-20 11:47:40.891684','Hello Clara S,\n\nA free dedicated Event Coordinator has been assigned to your request: Engagements.\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n',_binary '\0','Your Event Coordinator has been assigned',11),(24,'2026-09-20 11:47:40.893819','You have been assigned to a customer request.\n\nCustomer: Clara S\nPhone: 0765556732\nEmail: clara122@gmail.com\nPackage: Engagements\nEvent type: Engagements\nDate: 2026-09-21\nVenue: Cinnamon Grand\nGuests: 90\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, LED screens, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: guest count might change\n',_binary '\0','New event assigned to you',3),(25,'2026-09-20 11:48:54.148847','You were assigned to Engagements — Clara S on 2026-09-21',_binary '\0','New assignment',13),(26,'2026-09-20 12:29:50.874623','Sehansa Clara requested Birthday Parties. Assign a coordinator from Customer requests.',_binary '\0','Package request',2),(27,'2026-09-20 12:30:22.209182','Hello Sehansa Clara,\n\nA free dedicated Event Coordinator has been assigned to your request: Birthday Parties.\n\nCoordinator: Samanthi Silva\nPhone: 0770000003\nEmail: coord@eventplan.lk\nSpecialties: Weddings, homecomings, catering coordination\nExperience: 9 years\nWedding, homecoming, and hotel-liaison specialist. Calm timelines and trusted vendor lists.\n\nCustomer reviews:\n- 4/5 · Kasun R. — Great bridal and photographer recommendations without pressure.\n- 5/5 · Nimasha P. — Handled our wedding timeline calmly and kept the hotel catering on track.\n\nYou can message your coordinator from My requests. If you would like a different coordinator, use Request another coordinator or contact Support.\n',_binary '\0','Your Event Coordinator has been assigned',15),(28,'2026-09-20 12:30:22.211571','You have been assigned to a customer request.\n\nCustomer: Sehansa Clara\nPhone: 0761115034\nEmail: sehaclara@gmail.com\nPackage: Birthday Parties\nEvent type: Birthday Parties\nDate: 2026-09-30\nVenue: Mirissa\nGuests: 60\nServices: Decorations, stages & drapes, Floral arrangements, Lighting, Special effects (smoke / fireworks), Drone coverage, DJ / sound, Live band / popular artist (on inquiry), Catering coordination with the hotel\nVision / notes: Location might be changed\n',_binary '\0','New event assigned to you',3),(29,'2026-09-20 12:31:54.745772','Sehansa Clara · Birthday Parties\nScope: Basic package (no changes)\nBaseline: LKR 220000.00\nSuggested quote: LKR 220000.00\nAdditions: Fireworks\nReductions: Decrease the amount of drones\n\nOverview:\nBaseline\n\nCreate the quotation from Package overviews, then send the invoice.',_binary '\0','Package overview ready: Birthday Parties',4),(30,'2026-09-20 12:31:54.748194','Your coordinator sent the agreed package to finance. You will receive a quotation next. You cannot pay until finance sends that quotation and then the invoice.',_binary '\0','Package sent to finance',15),(31,'2026-09-20 12:33:53.228376','You were assigned to Birthday Parties — Sehansa Clara on 2026-09-30',_binary '\0','New assignment',14),(32,'2026-09-20 12:37:41.132769','You were assigned to Engagements — Clara S on 2026-09-21',_binary '\0','New assignment',14),(33,'2026-09-20 12:39:51.053632','Quotation QMM - 005 for Birthday Parties — Sehansa Clara.\nAmount: LKR 220000.00\nBirthday Parties baseline LKR 220000.00. Basic package (no changes). Baseline\nPlease review. The full invoice amount will be due once finance issues the bill.',_binary '\0','Ceylon Celebrations quotation QMM - 005',15),(34,'2026-09-20 12:42:59.710738','A vendor payment was recorded for Birthday Parties — Sehansa Clara: PAID / LKR 30000',_binary '\0','Payment update',14);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `package_briefs`
--

DROP TABLE IF EXISTS `package_briefs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `package_briefs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `additions` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `baseline_package_name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `baseline_price` decimal(12,2) DEFAULT NULL,
  `conversation_notes` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `finance_overview` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reductions` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` enum('BASIC_PACKAGE','WITH_CHANGES') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DRAFT','SENT_TO_FINANCE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `suggested_amount` decimal(12,2) DEFAULT NULL,
  `booking_id` bigint NOT NULL,
  `event_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK3rhixfgna3c566dmkda43x2as` (`booking_id`),
  KEY `FKh1b6cggglqergjdw29epyax9o` (`event_id`),
  CONSTRAINT `FKh1b6cggglqergjdw29epyax9o` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKiecr7qm7cmg5akoqq4ld8pu18` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `package_briefs`
--

LOCK TABLES `package_briefs` WRITE;
/*!40000 ALTER TABLE `package_briefs` DISABLE KEYS */;
INSERT INTO `package_briefs` VALUES (1,NULL,'Proposals & Surprises (Marry Me)',280000.00,NULL,'guest count may be chnaged (test)','decerese the guest count','WITH_CHANGES','SENT_TO_FINANCE','2026-09-17 17:33:56.247091',200000.00,1,2),(2,'Fireworks','Birthday Parties',220000.00,'null','full package','nothing changed','BASIC_PACKAGE','SENT_TO_FINANCE','2026-09-18 09:48:04.277260',220000.00,2,3),(3,'Fireworks','Birthday Parties',220000.00,'Nothing extra','Baseline','Decrease the amount of drones','BASIC_PACKAGE','SENT_TO_FINANCE','2026-09-20 12:31:54.738780',220000.00,4,5);
/*!40000 ALTER TABLE `package_briefs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_date` date NOT NULL,
  `reference_note` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('FAILED','OVERDUE','PAID','PENDING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('CUSTOMER','VENDOR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `budget_item_id` bigint DEFAULT NULL,
  `event_id` bigint DEFAULT NULL,
  `invoice_id` bigint DEFAULT NULL,
  `vendor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkvjiqylmqivcfu26w759451vw` (`budget_item_id`),
  KEY `FKmok6urmuf6s9wdl5hxv8nv3oy` (`event_id`),
  KEY `FKrbqec6be74wab8iifh8g3i50i` (`invoice_id`),
  KEY `FK1njyyedmty47ws9am8tfmky6k` (`vendor_id`),
  CONSTRAINT `FK1njyyedmty47ws9am8tfmky6k` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`),
  CONSTRAINT `FKkvjiqylmqivcfu26w759451vw` FOREIGN KEY (`budget_item_id`) REFERENCES `budget_items` (`id`),
  CONSTRAINT `FKmok6urmuf6s9wdl5hxv8nv3oy` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKrbqec6be74wab8iifh8g3i50i` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,200000.00,'Sandbox','2026-09-17','Full invoice — booking #1','PAID','CUSTOMER',NULL,2,1,NULL),(2,180000.00,'cash','2026-09-19','','PAID','VENDOR',NULL,2,NULL,1),(3,60000.00,'cash','2026-09-20','for full package ','PAID','VENDOR',1,3,2,2),(4,30000.00,'cash','2026-09-30','','PAID','VENDOR',NULL,5,4,3);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quotation_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACCEPTED','DRAFT','REJECTED','SENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `valid_until` date NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9kbnjdxcf5d7qxwy80ple68bh` (`quotation_number`),
  KEY `FKg5ydtq1cutmdrllguhbucga4v` (`event_id`),
  CONSTRAINT `FKg5ydtq1cutmdrllguhbucga4v` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
INSERT INTO `quotations` VALUES (1,200000.00,'Proposals & Surprises (Marry Me) baseline LKR 280000.00. Package with changes. guest count may be chnaged (test)','QMM - 001','SENT','2026-09-20',2),(2,220000.00,'All inclusive package','QMM - 002','SENT','2026-09-20',3),(3,220000.00,'Birthday Parties baseline LKR 220000.00. Basic package (no changes). Baseline','QMM - 005','SENT','2026-09-28',5);
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_bookings`
--

DROP TABLE IF EXISTS `service_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_date` date NOT NULL,
  `communication_notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('PAID','PENDING','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','PENDING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_coordinator_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK662lye64micwg18cbg12029ay` (`event_coordinator_id`),
  CONSTRAINT `FK662lye64micwg18cbg12029ay` FOREIGN KEY (`event_coordinator_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_bookings`
--

LOCK TABLES `service_bookings` WRITE;
/*!40000 ALTER TABLE `service_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_assignments`
--

DROP TABLE IF EXISTS `staff_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `staff_id` bigint NOT NULL,
  `task_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKv0ld5dbjxerkhb8unigmp1sl` (`staff_id`),
  KEY `FK9rr4wi4a4ylrbfy2jv31ixugc` (`task_id`),
  CONSTRAINT `FK9rr4wi4a4ylrbfy2jv31ixugc` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  CONSTRAINT `FKv0ld5dbjxerkhb8unigmp1sl` FOREIGN KEY (`staff_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_assignments`
--

LOCK TABLES `staff_assignments` WRITE;
/*!40000 ALTER TABLE `staff_assignments` DISABLE KEYS */;
INSERT INTO `staff_assignments` VALUES (1,9,1);
/*!40000 ALTER TABLE `staff_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_requests`
--

DROP TABLE IF EXISTS `support_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('CLOSED','OPEN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_id` bigint DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKquwhu9wspv8weuma6gee0gtwf` (`booking_id`),
  KEY `FK31didjnu75m09ycmf3cge6cyd` (`customer_id`),
  CONSTRAINT `FK31didjnu75m09ycmf3cge6cyd` FOREIGN KEY (`customer_id`) REFERENCES `app_users` (`id`),
  CONSTRAINT `FKquwhu9wspv8weuma6gee0gtwf` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_requests`
--

LOCK TABLES `support_requests` WRITE;
/*!40000 ALTER TABLE `support_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progress` int NOT NULL,
  `status` enum('DONE','IN_PROGRESS','TODO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `priority` enum('HIGH','LOW','MEDIUM') COLLATE utf8mb4_unicode_ci NOT NULL,
  `assignee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKso3gaw278lqccjow3yxkck6wx` (`event_id`),
  KEY `FKekr1dgiqktpyoip3qmp6lxsit` (`assignee_id`),
  CONSTRAINT `FKekr1dgiqktpyoip3qmp6lxsit` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKso3gaw278lqccjow3yxkck6wx` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `tasks_chk_1` CHECK (((`progress` >= 0) and (`progress` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'need to contact and confirm (test)',100,'DONE','stage maker',1,NULL,'HIGH',NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline_items`
--

DROP TABLE IF EXISTS `timeline_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `end_time` time(6) NOT NULL,
  `item_date` date NOT NULL,
  `notes` varchar(800) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shared_with_customer` bit(1) NOT NULL,
  `start_time` time(6) NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6omwttijxrlmtxu43xiga9798` (`event_id`),
  CONSTRAINT `FK6omwttijxrlmtxu43xiga9798` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_items`
--

LOCK TABLES `timeline_items` WRITE;
/*!40000 ALTER TABLE `timeline_items` DISABLE KEYS */;
INSERT INTO `timeline_items` VALUES (1,'10:00:00.000000','2026-09-20','test ',_binary '\0','09:30:00.000000','guest arrival - 9.30',2),(2,'11:00:00.000000','2026-09-20','cue lights',_binary '\0','10:00:00.000000','guest arrivals',3);
/*!40000 ALTER TABLE `timeline_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ADMIN','CUSTOMER','EVENT_COORDINATOR','FINANCE_OFFICER','OPERATIONS_MANAGER','VENDOR') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'vendor@test.com','Test Vendor','password','1234567890','VENDOR');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_assignments`
--

DROP TABLE IF EXISTS `vendor_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assignment_date` date NOT NULL,
  `notes` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reject_reason` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','REJECTED','REQUESTED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` bigint NOT NULL,
  `service_id` bigint DEFAULT NULL,
  `vendor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7ph65uvvvk2cweu4is8ci3x47` (`event_id`),
  KEY `FKrlgdg581a40yo45f012amcruc` (`service_id`),
  KEY `FKdijd4qyv7y35tutde1kyov04` (`vendor_id`),
  CONSTRAINT `FK7ph65uvvvk2cweu4is8ci3x47` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKdijd4qyv7y35tutde1kyov04` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`),
  CONSTRAINT `FKrlgdg581a40yo45f012amcruc` FOREIGN KEY (`service_id`) REFERENCES `vendor_services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_assignments`
--

LOCK TABLES `vendor_assignments` WRITE;
/*!40000 ALTER TABLE `vendor_assignments` DISABLE KEYS */;
INSERT INTO `vendor_assignments` VALUES (1,'2026-09-20','for 15 guest (test)',NULL,'CONFIRMED',2,NULL,1),(2,'2026-09-20','',NULL,'CONFIRMED',3,NULL,2),(3,'2026-09-21','',NULL,'REQUESTED',4,NULL,2),(4,'2026-09-30','Birthday photoshoot',NULL,'REQUESTED',5,NULL,3),(5,'2026-09-21','Engagement photoshoot',NULL,'REQUESTED',4,NULL,3),(6,'2026-12-20','Arrive by 7 AM',NULL,'REQUESTED',1,1,1),(7,'2026-12-30','photoshoot',NULL,'REQUESTED',2,2,2);
/*!40000 ALTER TABLE `vendor_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_availability`
--

DROP TABLE IF EXISTS `vendor_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blocked` bit(1) NOT NULL,
  `end_time` time(6) NOT NULL,
  `slot_date` date NOT NULL,
  `start_time` time(6) NOT NULL,
  `vendor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKehmgbfif86j5v2f6s1qd4kril` (`vendor_id`),
  CONSTRAINT `FKehmgbfif86j5v2f6s1qd4kril` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_availability`
--

LOCK TABLES `vendor_availability` WRITE;
/*!40000 ALTER TABLE `vendor_availability` DISABLE KEYS */;
INSERT INTO `vendor_availability` VALUES (1,_binary '\0','21:45:00.000000','2026-09-20','09:45:00.000000',1),(2,_binary '\0','17:45:00.000000','2026-09-22','11:30:00.000000',2),(3,_binary '\0','18:00:00.000000','2026-12-20','08:00:00.000000',1),(4,_binary '\0','17:00:00.000000','2026-10-15','09:00:00.000000',1);
/*!40000 ALTER TABLE `vendor_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_profiles`
--

DROP TABLE IF EXISTS `vendor_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_area` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK54wrcif7ltdw3bocsbe3twow9` (`user_id`),
  CONSTRAINT `FKn6euh1k46al6du0mm1fmh264p` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_profiles`
--

LOCK TABLES `vendor_profiles` WRITE;
/*!40000 ALTER TABLE `vendor_profiles` DISABLE KEYS */;
INSERT INTO `vendor_profiles` VALUES (1,'Catering','Golden Plate Catering','Wedding and corporate catering.','Colombo',5),(2,'Decoration','Nethra Flowers','Fresh flower decorations','Colombo',13),(3,'Photography','Sandra Photography','Event Photography','Colombo',14),(4,'DECOR','Lanka Decor Pvt Ltd','Wedding and stage decoration','Colombo',3);
/*!40000 ALTER TABLE `vendor_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_services`
--

DROP TABLE IF EXISTS `vendor_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `capacity` int NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `vendor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsn95xu9qn5yi3r66u12pj6wp6` (`vendor_id`),
  CONSTRAINT `FKsn95xu9qn5yi3r66u12pj6wp6` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`),
  CONSTRAINT `vendor_services_chk_1` CHECK ((`capacity` >= 1))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_services`
--

LOCK TABLES `vendor_services` WRITE;
/*!40000 ALTER TABLE `vendor_services` DISABLE KEYS */;
INSERT INTO `vendor_services` VALUES (1,150,'Catering','Buffet for up to 150 guests','Gold Wedding Menu',185000,1),(2,20,'Catering','only for 20 guests\r\n5-4 varieties','Silver catering ',100000,1),(3,50,'Decoration','Fresh Flowers decoration','Flowers',30000,2),(4,30,'Decoration','Color wise decor','Fresh flowers',50000,2),(5,1,'Photography','20 photos','Birthday Shoot',30000,3),(6,2,'Photography','Engagement Photography','Engagements',75000,3),(7,200,'DECOR','Floral stage setup','Stage Decoration',45000,1),(8,100,'DECOR','Centerpieces for 10 tables','Table Decoration',25000,1),(9,100,'Catering','Full course meal for 100 people','Catering Package A',1500,1);
/*!40000 ALTER TABLE `vendor_services` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-06 19:26:15
