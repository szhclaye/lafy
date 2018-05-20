/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

-- ----------------------------
--  Table structure for `courtNewsList`
-- ----------------------------
-- DROP TABLE IF EXISTS `courtNewsList`;
-- CREATE TABLE courtNewsList (
--   newId int(100)  PRIMARY KEY NOT NULL,
--   title varchar(100),
--   time varchar(100), 
--   pageImgUrl varchar(100),
--   pageContent varchar(2048), 
-- ) ENGINE=InnoDB;


SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `courtNewsList`;
CREATE TABLE `courtNewsList` (
  `newId` varchar(100)   NOT NULL,
  `time` varchar(100)   NOT NULL,
  `title` varchar(100)   NOT NULL,
   `readnum` varchar(100)   NOT NULL,
  `pageImgUrl` varchar(2048)   NOT NULL,
  `pageContent` varchar(2048)   NOT NULL,
  PRIMARY KEY (`newId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4  COMMENT='会话管理用户信息';

SET FOREIGN_KEY_CHECKS = 1;