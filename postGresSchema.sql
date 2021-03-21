DROP DATABASE IF EXISTS qanda;
-- DROP TABLE IF EXISTS Users;

CREATE DATABASE qanda;

USE qanda;

DROP TABLE IF EXISTS questions CASCADE;



CREATE TABLE questions (
  id SERIAL,
  question_id SERIAL,
  product_id INT NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date DATE NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  question_email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  question_helpfulness INT DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE (question_id)
);

DROP TABLE IF EXISTS answers CASCADE;

CREATE TABLE answers (
  id SERIAL,
  a_id SERIAL,
  q_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date DATE NOT NULL,
  answerer_name VARCHAR(60) NOT NULL,
  answer_email VARCHAR(60) NOT NULL,
  answer_reported BOOLEAN DEFAULT FALSE,
  helpfulness INT DEFAULT 0,
  PRIMARY KEY (id),
    FOREIGN KEY (q_id)
      REFERENCES questions(question_id)
        ON DELETE CASCADE,
  UNIQUE (a_id)
);

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id SERIAL,
  photo_id SERIAL,
  answer_id INT NOT NULL,
  photo_url VARCHAR(250) DEFAULT NULL,
  PRIMARY KEY (id),
    FOREIGN KEY (answer_id)
      REFERENCES answers (a_id)
        ON DELETE CASCADE,
  UNIQUE (photo_id)
);