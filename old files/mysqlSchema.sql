-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

DROP DATABASE IF EXISTS QandA;
-- DROP TABLE IF EXISTS Users;
-- const mysql =require('mysql');

CREATE DATABASE QandA;

USE QandA;

-- ---
-- Table 'Questions'
--
-- ---

DROP TABLE IF EXISTS Questions;

CREATE TABLE Questions (
  question_id INTEGER NOT NULL AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date DATE NOT NULL,
  question_name VARCHAR(60) NOT NULL,
  question_email VARCHAR(60) NOT NULL,
  question_helpfulness SMALLINT DEFAULT NULL,
  question_reported TINYINT DEFAULT NULL,
  PRIMARY KEY (question_id)
);

-- ---
-- Table 'answers'
--
-- ---

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  answer_id INTEGER NOT NULL AUTO_INCREMENT,
  question_id INTEGER NOT NULL,
  answer_body VARCHAR(1000) NOT NULL,
  answer_date DATE NOT NULL,
  answer_name VARCHAR(60) NOT NULL,
  answer_email VARCHAR(60) NOT NULL,
  answer_helpfulness SMALLINT DEFAULT NULL,
  answer_reported TINYINT DEFAULT NULL,
  PRIMARY KEY (answer_id),
  FOREIGN KEY (question_id) REFERENCES Questions (question_id)
    ON DELETE CASCADE
);

-- ---
-- Table 'photos'
--
-- ---

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  photo_id INTEGER NOT NULL AUTO_INCREMENT,
  answer_id INTEGER NOT NULL,
  photo_url VARCHAR(250) NOT NULL DEFAULT NULL,
  PRIMARY KEY (photo_id),
  FOREIGN KEY (answer_id) REFERENCES answers (answer_id)
    ON DELETE CASCADE
);

-- ---
-- Foreign Keys
-- ---

-- ALTER TABLE answers ADD FOREIGN KEY (question_id) REFERENCES Questions (question_id);
-- ALTER TABLE photos ADD FOREIGN KEY (answer_id) REFERENCES answers (answer_id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE Questions ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE answers ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE photos ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE new table ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO Questions (question_id,product_id,question_body,question_date,question_name,question_email,question_helpfulness,question_reported) VALUES
-- ('','','','','','','','');
-- INSERT INTO answers (answer_id,question_id,answer_body,answer_date,answer_name,answer_email,answer_helpfulness,answer_reported) VALUES
-- ('','','','','','','','');
-- INSERT INTO photos (product_id,answer_id,product_url) VALUES
-- ('','','');
-- INSERT INTO new table (id) VALUES
-- ('');