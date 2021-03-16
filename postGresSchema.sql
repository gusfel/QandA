DROP DATABASE IF EXISTS QandA;
-- DROP TABLE IF EXISTS Users;

CREATE DATABASE QandA;

-- USE QandA;

DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos;

CREATE TABLE questions (
  question_id SERIAL,
  product_id INT NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date DATE NOT NULL,
  question_name VARCHAR(60) NOT NULL,
  question_email VARCHAR(60) NOT NULL,
  question_helpfulness INT DEFAULT NULL,
  question_reported SMALLINT DEFAULT NULL,
  PRIMARY KEY (question_id)
);

CREATE TABLE answers (
  answer_id SERIAL,
  question_id INT NOT NULL,
  answer_body VARCHAR(1000) NOT NULL,
  answer_date DATE NOT NULL,
  answer_name VARCHAR(60) NOT NULL,
  answer_email VARCHAR(60) NOT NULL,
  answer_helpfulness INT DEFAULT NULL,
  answer_reported SMALLINT DEFAULT NULL,
  PRIMARY KEY (answer_id),
  CONSTRAINT fk_question
    FOREIGN KEY (question_id)
      REFERENCES questions(question_id)
        ON DELETE CASCADE
);

CREATE TABLE photos (
  photo_id SERIAL,
  answer_id INT NOT NULL,
  photo_url VARCHAR(250) NOT NULL DEFAULT NULL,
  PRIMARY KEY (photo_id),
  CONSTRAINT fk_answer
    FOREIGN KEY (answer_id)
      REFERENCES answers (answer_id)
        ON DELETE CASCADE
);