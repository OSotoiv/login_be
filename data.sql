DROP DATABASE IF EXISTS usersdb;

CREATE DATABASE usersdb;

\c usersdb;

DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL
);

INSERT INTO users
(name, type)
VALUES 
('Solomon Soto', 'kid');

INSERT INTO users
(name, type)
VALUES 
('Malachi Soto', 'kid');

INSERT INTO users
(name, type)
VALUES 
('Delilah Soto', 'mom');

INSERT INTO users
(name, type)
VALUES 
('Octavian Soto', 'dad');