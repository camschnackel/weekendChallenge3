CREATE TABLE tasks (
id SERIAL PRIMARY KEY,
task VARCHAR(100),
completed BOOLEAN DEFAULT FALSE,
created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
due VARCHAR(100)
);