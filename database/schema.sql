-- AUTHORIZED CYBERSECURITY TRAINING LAB
-- Demo schema only. All data is fictional. Do not store real credentials here.

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  username       TEXT NOT NULL UNIQUE,
  password       TEXT NOT NULL,       -- plaintext DEMO password, intentionally simple for the lab
  role           TEXT NOT NULL DEFAULT 'student',
  student_id     TEXT NOT NULL,
  department     TEXT NOT NULL,
  academic_year  TEXT NOT NULL
);

DROP TABLE IF EXISTS lab_logs;
CREATE TABLE lab_logs (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp      TEXT NOT NULL,
  method         TEXT NOT NULL,
  endpoint       TEXT NOT NULL,
  challenge      TEXT,
  source_ip      TEXT,
  success        INTEGER NOT NULL,     -- 1 = success, 0 = failure
  detail         TEXT                  -- short, non-sensitive note (no passwords/tokens)
);
