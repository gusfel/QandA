DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS photos;

CREATE TABLE questions (
  question_id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  product_id INT NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_date DATE NOT NULL,
  question_name VARCHAR(60) NOT NULL,
  question_email INT NOT NULL,
  question_helpfulness INT DEFAULT NULL,
  question_reported BOOLEAN DEFAULT NULL,
  PRIMARY KEY (question_id)
);

CREATE TABLE answers (
  answer_id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  question_id INT NOT NULL,
  answer_body VARCHAR(1000) NOT NULL,
  answer_date DATE NOT NULL,
  answer_name VARCHAR(60) NOT NULL,
  answer_email VARCHAR(60) NOT NULL,
  answer_helpfulness INT DEFAULT NULL,
  answer_reported BOOLEAN DEFAULT NULL,
  PRIMARY KEY (answer_id),
  CONSTRAINT fk_question
    FOREIGN KEY (question_id)
      REFERENCES questions(question_id)
        ON DELETE CASCADE
);

CREATE TABLE photos (
  photo_id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
  answer_id INT NOT NULL,
  photo_url VARCHAR(250) NOT NULL DEFAULT NULL,
  PRIMARY KEY (photo_id),
  CONSTRAINT fk_answer
    FOREIGN KEY (answer_id)
      REFERENCES answers (answer_id)
        ON DELETE CASCADE
);