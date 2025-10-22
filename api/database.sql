CREATE DATABASE IF NOT EXISTS job_board;

CREATE USER IF NOT EXISTS 'API_USER'@'%' IDENTIFIED BY 'wD7GbP@NcakIU9EB';
GRANT ALL ON job_board.* TO 'API_USER'@'%';
FLUSH PRIVILEGES;

USE job_board;


CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO companies(name,address,description) VALUES
  ("Nike","3 rue de François Mitterrand","vends des Chaussures, Just Do It"),
  ("Lica Mobile","2 Avenue de kremlin","Vente de téléphone et autres outils informatiques"),
  ("Archimede's infrastructure","55 place du gremlins","Cabinet d'Architecte");

CREATE TABLE IF NOT EXISTS advertisements (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  title varchar(200) NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  salary varchar(20) NOT NULL,
  position_type ENUM('CDI','CDD','Internship','Apprenticeship','Interim','Part-time') NOT NULL,
  location TEXT NOT NULL,
  schedule varchar(100) NOT NULL,
  experience ENUM('Senior','Mid','Entry') NOT NULL,
  company_id INTEGER,
  FOREIGN KEY(company_id) REFERENCES companies(id)
);

INSERT INTO advertisements(title,short_description,full_description,salary,position_type,location,schedule,experience,company_id) VALUES
("Developpeur PHP","Join our dynamic team to develop innovative web applications with React and Node.js.","We are looking for an experienced full stack developer to join our development team. You will be responsible for designing and developing modern web applications, from backend architecture to user interface. You will work with cutting-edge technologies like React, Node.js, TypeScript and NoSQL databases. The ideal candidate will have solid experience in web development and a passion for new technologies.","$80,000 - 120,000","CDI","New York, NY","Full time","Senior",2);

CREATE TABLE IF NOT EXISTS TYPE_PEOPLE(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  libelle ENUM('Administrator','Company','Candidate')
);

INSERT INTO TYPE_PEOPLE(libelle) VALUES('Administrator'),('Company'),('Candidate');


CREATE TABLE IF NOT EXISTS people(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email varchar(200) NOT NULL UNIQUE,
  phone varchar(15) NOT NULL,
  password text NOT NULL,
  skills JSON,
  type_people INTEGER NOT NULL,
  company_id INTEGER,
  FOREIGN KEY(type_people) references TYPE_PEOPLE(id),
  FOREIGN KEY(company_id) references companies(id),
  CONSTRAINT chk_company CHECK((type_people <> 2) or (company_id IS NOT NULL)),
  CONSTRAINT chk_skills CHECK((type_people <> 3) or (skills IS NOT NULL))
);

insert into people(last_name,first_name,email,phone,password,type_people) values("Test","Admin","admintest@example.com","06 66 66 66 66","$2b$10$/Q9vVjJX/f3J00pUyTE1fetUomMc/sRBUu2GXNqWa1g.Uko72mjMm", 1);

CREATE TABLE IF NOT EXISTS applications(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  email varchar(200) NOT NULL,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  ad_id INTEGER,
  date_application DATE NOT NULL,
  message TEXT NOT NULL,
  FOREIGN KEY(ad_id) REFERENCES advertisements(id)
);
