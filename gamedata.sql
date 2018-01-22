CREATE TABLE gamedata(
   id SERIAL PRIMARY KEY,
   username VARCHAR,
    active INT NOT NULL,
    turn INT NOT NULL,
    hits INT NOT NULL,
    score INT, 
    shipdata JSON NOT NULL,
    gamestate JSON NOT NULL,
    timeout INT
);
